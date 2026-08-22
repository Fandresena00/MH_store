<?php

namespace App\Controller\Api;

use App\Repository\OrderRepository;
use App\Service\ApiNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class OrderController extends AbstractController
{
    /**
     * Suivi public par référence — volontairement PUBLIC_ACCESS (voir
     * security.yaml) car un client invité, sans compte, doit pouvoir
     * suivre sa commande simplement avec le numéro reçu par email.
     */
    #[Route('/api/orders/{reference}', name: 'api_order_show', methods: ['GET'])]
    public function show(string $reference, OrderRepository $orderRepository, ApiNormalizer $normalizer): JsonResponse
    {
        $order = $orderRepository->findOneByReference($reference);
        if (!$order) {
            return new JsonResponse(['error' => 'Commande introuvable.'], 404);
        }

        return new JsonResponse(['data' => $normalizer->order($order)]);
    }

    #[Route('/api/account/orders', name: 'api_account_orders', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function myOrders(OrderRepository $orderRepository, ApiNormalizer $normalizer): JsonResponse
    {
        $orders = $orderRepository->findForUser($this->getUser());

        return new JsonResponse(['data' => array_map(fn ($o) => $normalizer->order($o, withItems: false), $orders)]);
    }
}
