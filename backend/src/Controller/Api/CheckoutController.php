<?php

namespace App\Controller\Api;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Repository\ProductRepository;
use App\Service\PapiService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/checkout', name: 'api_checkout_')]
class CheckoutController extends AbstractController
{
    private const FREE_SHIPPING_THRESHOLD = 150000;
    private const SHIPPING_COST = 8000;

    /**
     * Corps attendu :
     * {
     *   "lines": [{"productId": 1, "quantity": 2}, ...],
     *   "paymentMethod": "MVOLA" | "ORANGE_MONEY" | "ARTEL_MONEY" | "BRED",
     *   "shippingAddress": "...", "shippingCity": "...",
     *   "clientName": "...", "email": "...", "phone": "..."
     * }
     * Les prix sont TOUJOURS recalculés depuis la base — jamais depuis les
     * valeurs envoyées par le client, pour éviter toute manipulation.
     */
    #[Route('', name: 'confirm', methods: ['POST'])]
    public function confirm(
        Request $request,
        ProductRepository $productRepository,
        EntityManagerInterface $em,
        PapiService $papi,
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return new JsonResponse(['error' => 'Le corps de la requête doit être un JSON valide.'], 400);
        }

        $lines = $payload['lines'] ?? [];

        if (!is_array($lines) || empty($lines)) {
            return new JsonResponse(['error' => 'Le panier est vide.'], 400);
        }

        $provider = (string) ($payload['paymentMethod'] ?? PapiService::PROVIDER_MVOLA);
        if (!array_key_exists($provider, PapiService::PROVIDERS)) {
            return new JsonResponse(['error' => 'Moyen de paiement invalide.'], 400);
        }

        foreach (['shippingAddress', 'shippingCity', 'email'] as $field) {
            if ('' === trim((string) ($payload[$field] ?? ''))) {
                return new JsonResponse(['error' => 'Le champ '.$field.' est requis.'], 400);
            }
        }

        $order = new Order();
        $order->setReference('MH-'.random_int(10000, 99999));
        $order->setUser($this->getUser());
        $order->setPaymentMethod($provider);
        $order->setPaymentStatus(Order::PAYMENT_PENDING);
        $order->setShippingAddress((string) ($payload['shippingAddress'] ?? ''));
        $order->setShippingCity((string) ($payload['shippingCity'] ?? ''));
        if (!$this->getUser()) {
            $order->setGuestEmail((string) ($payload['email'] ?? '') ?: null);
        }

        $subtotal = 0;
        foreach ($lines as $line) {
            $productId = (int) ($line['productId'] ?? 0);
            $quantity = max(1, (int) ($line['quantity'] ?? 1));

            $product = $productRepository->find($productId);
            if (!$product) {
                return new JsonResponse(['error' => 'Produit introuvable (id '.$productId.').'], 400);
            }

            if ($quantity > $product->getStock()) {
                return new JsonResponse([
                    'error' => sprintf('Stock insuffisant pour « %s » (%d disponible(s)).', $product->getName(), $product->getStock()),
                ], 409);
            }

            $item = new OrderItem();
            $item->setProduct($product);
            $item->setQuantity($quantity);
            $item->setUnitPrice($product->getPrice()); // prix figé depuis la base, pas depuis le client
            $order->addItem($item);
            $product->setStock($product->getStock() - $quantity);

            $subtotal += $product->getPrice() * $quantity;
        }

        $shipping = ($subtotal >= self::FREE_SHIPPING_THRESHOLD) ? 0 : self::SHIPPING_COST;
        $order->setSubtotal($subtotal);
        $order->setShippingCost($shipping);

        $em->persist($order);
        $em->flush();

        try {
            $result = $papi->createPaymentLink(
                $order,
                $provider,
                (string) ($payload['clientName'] ?? '') ?: null,
                (string) ($payload['email'] ?? '') ?: null,
                (string) ($payload['phone'] ?? '') ?: null,
            );
        } catch (\RuntimeException $e) {
            foreach ($order->getItems() as $item) {
                $product = $item->getProduct();
                $product->setStock($product->getStock() + $item->getQuantity());
            }
            $em->remove($order);
            $em->flush();

            return new JsonResponse(['error' => $e->getMessage(), 'reference' => $order->getReference()], 502);
        }

        $order->setPapiNotificationToken($result['notificationToken']);
        $order->setPapiPaymentLink($result['paymentLink']);
        $em->flush();

        return new JsonResponse([
            'reference' => $order->getReference(),
            'total' => $order->getTotal(),
            'paymentLink' => $result['paymentLink'],
        ]);
    }
}
