<?php

namespace App\Service;

use App\Entity\Order;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\Exception\ExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Intégration PAPI.mg (https://docs.papi.mg) — Mobile Money (MVola, Orange
 * Money, Airtel Money) et carte bancaire (Visa/Mastercard, via "BRED" côté
 * PAPI). Le frontend Next.js appelle POST /api/checkout, qui crée la
 * commande puis obtient un lien de paiement PAPI à retourner au client.
 *
 * Important : successUrl/failureUrl pointent vers le FRONTEND Next.js (pas
 * vers ce backend) puisque c'est lui qui affiche les pages de confirmation.
 * notificationUrl, elle, reste sur ce backend — c'est PAPI qui l'appelle en
 * serveur à serveur, jamais le navigateur du client.
 */
class PapiService
{
    public const PROVIDER_MVOLA = 'MVOLA';
    public const PROVIDER_ORANGE_MONEY = 'ORANGE_MONEY';
    public const PROVIDER_AIRTEL_MONEY = 'ARTEL_MONEY'; // orthographe exacte de l'API PAPI
    public const PROVIDER_CARD = 'BRED'; // carte bancaire Visa / Mastercard

    public const PROVIDERS = [
        self::PROVIDER_MVOLA => 'MVola',
        self::PROVIDER_ORANGE_MONEY => 'Orange Money',
        self::PROVIDER_AIRTEL_MONEY => 'Airtel Money',
        self::PROVIDER_CARD => 'Carte bancaire (Visa / Mastercard)',
    ];

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly UrlGeneratorInterface $urlGenerator,
        private readonly LoggerInterface $logger,
        private readonly string $papiApiKey,
        private readonly string $papiApiUrl,
        private readonly bool $papiTestMode,
        private readonly string $frontendUrl,
    ) {
    }

    /**
     * @return array{paymentLink: string, notificationToken: string}
     *
     * @throws \RuntimeException si PAPI refuse la requête ou est injoignable
     */
    public function createPaymentLink(Order $order, string $provider, ?string $clientName = null, ?string $payerEmail = null, ?string $payerPhone = null): array
    {
        if (!array_key_exists($provider, self::PROVIDERS)) {
            throw new \InvalidArgumentException('Moyen de paiement PAPI inconnu : '.$provider);
        }

        $payload = [
            'amount' => (float) $order->getTotal(),
            'clientName' => $clientName ?: ($order->getUser()?->getFullName() ?? 'Client M&H Store'),
            'reference' => $order->getReference(),
            'description' => 'Commande '.$order->getReference().' — M&H Store',
            'successUrl' => rtrim($this->frontendUrl, '/').'/checkout/succes/'.$order->getReference(),
            'failureUrl' => rtrim($this->frontendUrl, '/').'/checkout/echec/'.$order->getReference(),
            'notificationUrl' => $this->urlGenerator->generate('app_papi_webhook', [], UrlGeneratorInterface::ABSOLUTE_URL),
            'validDuration' => 60,
            'provider' => $provider,
            'isTestMode' => $this->papiTestMode,
        ];

        if ($payerEmail) {
            $payload['payerEmail'] = $payerEmail;
        }
        if ($payerPhone) {
            $payload['payerPhone'] = $payerPhone;
        }

        try {
            $response = $this->httpClient->request('POST', rtrim($this->papiApiUrl, '/').'/payment-links', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Token' => $this->papiApiKey,
                ],
                'json' => $payload,
                'timeout' => 15,
            ]);

            $data = $response->toArray(false);
        } catch (ExceptionInterface $e) {
            $this->logger->error('PAPI: échec de la création du lien de paiement', ['exception' => $e->getMessage(), 'order' => $order->getReference()]);

            throw new \RuntimeException('Impossible de joindre le service de paiement PAPI pour le moment.', previous: $e);
        }

        if (isset($data['error'])) {
            $this->logger->error('PAPI: erreur retournée par l\'API', ['error' => $data['error'], 'order' => $order->getReference()]);

            throw new \RuntimeException($data['error']['message'] ?? 'Erreur PAPI inconnue.');
        }

        $paymentLink = $data['data']['paymentLink'] ?? null;
        $notificationToken = $data['data']['notificationToken'] ?? null;

        if (!$paymentLink || !$notificationToken) {
            throw new \RuntimeException('Réponse PAPI invalide : lien de paiement manquant.');
        }

        return [
            'paymentLink' => $paymentLink,
            'notificationToken' => $notificationToken,
        ];
    }

    /**
     * Vérifie qu'une notification webhook provient bien de PAPI pour cette
     * commande — comparaison en temps constant (référence + jeton).
     */
    public function verifyNotification(Order $order, array $payload): bool
    {
        $reference = $payload['paymentReference'] ?? '';
        $token = $payload['notificationToken'] ?? '';

        if ('' === $token || null === $order->getPapiNotificationToken()) {
            return false;
        }

        return hash_equals($order->getReference(), $reference)
            && hash_equals($order->getPapiNotificationToken(), $token);
    }
}
