<?php

namespace App\Controller;

use App\Entity\Order;
use App\Repository\OrderRepository;
use App\Service\PapiService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Point d'entrée public appelé par PAPI (notificationUrl) — server-to-server,
 * jamais par le navigateur du client. Vérifié par référence + jeton, voir
 * PapiService::verifyNotification().
 */
class PapiWebhookController extends AbstractController
{
    #[Route('/paiement/papi/notification', name: 'app_papi_webhook', methods: ['POST'])]
    public function __invoke(
        Request $request,
        OrderRepository $orderRepository,
        PapiService $papi,
        EntityManagerInterface $em,
        LoggerInterface $logger,
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true) ?? [];

        $reference = $payload['paymentReference'] ?? null;
        if (!$reference) {
            return new JsonResponse(['error' => 'Référence manquante.'], 400);
        }

        $order = $orderRepository->findOneByReference($reference);
        if (!$order) {
            $logger->warning('PAPI webhook: commande introuvable', ['reference' => $reference]);

            return new JsonResponse(['error' => 'Commande introuvable.'], 404);
        }

        if (!$papi->verifyNotification($order, $payload)) {
            $logger->warning('PAPI webhook: jeton de notification invalide', ['reference' => $reference]);

            return new JsonResponse(['error' => 'Notification non authentifiée.'], 403);
        }

        if (Order::PAYMENT_SUCCESS === $order->getPaymentStatus()) {
            return new JsonResponse(['status' => 'already_processed']);
        }

        $status = $payload['paymentStatus'] ?? 'PENDING';

        match ($status) {
            'SUCCESS' => $order->setPaymentStatus(Order::PAYMENT_SUCCESS)->setStatus(Order::STATUS_CONFIRMED),
            'FAILED' => $order->setPaymentStatus(Order::PAYMENT_FAILED),
            default => $order->setPaymentStatus(Order::PAYMENT_PENDING),
        };

        $em->flush();
        $logger->info('PAPI webhook traité', ['reference' => $reference, 'status' => $status]);

        return new JsonResponse(['status' => 'ok']);
    }
}
