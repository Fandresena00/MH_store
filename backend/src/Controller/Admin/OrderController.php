<?php

namespace App\Controller\Admin;

use App\Entity\Order;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin/commandes')]
#[IsGranted('ROLE_ADMIN')]
class OrderController extends AbstractController
{
    private const STATUSES = [
        Order::STATUS_CONFIRMED => 'Confirmée',
        Order::STATUS_PREPARING => 'Préparation',
        Order::STATUS_SHIPPED => 'Expédiée',
        Order::STATUS_IN_TRANSIT => 'En transit',
        Order::STATUS_DELIVERED => 'Livrée',
    ];

    #[Route('', name: 'admin_order_index', methods: ['GET'])]
    public function index(Request $request, OrderRepository $orderRepository): Response
    {
        $status = $request->query->get('status');
        $search = trim((string) $request->query->get('q', ''));

        return $this->render('admin/order/index.html.twig', [
            'orders' => $orderRepository->findForAdmin($search, $status),
            'statuses' => self::STATUSES,
            'activeStatus' => $status,
            'search' => $search,
        ]);
    }

    #[Route('/{id}', name: 'admin_order_show', methods: ['GET'])]
    public function show(Order $order): Response
    {
        return $this->render('admin/order/show.html.twig', ['order' => $order, 'statuses' => self::STATUSES]);
    }

    #[Route('/{id}/statut', name: 'admin_order_update_status', methods: ['POST'])]
    public function updateStatus(Order $order, Request $request, EntityManagerInterface $em): Response
    {
        $status = $request->request->get('status');
        if (array_key_exists($status, self::STATUSES)) {
            $order->setStatus($status);
            $em->flush();
            $this->addFlash('success', 'Statut de la commande '.$order->getReference().' mis à jour.');
        }

        return $this->redirectToRoute('admin_order_show', ['id' => $order->getId()]);
    }
}
