<?php

namespace App\Controller\Admin;

use App\Repository\BlogPostRepository;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
class DashboardController extends AbstractController
{
    #[Route('', name: 'admin_dashboard', methods: ['GET'])]
    public function index(
        ProductRepository $productRepository,
        OrderRepository $orderRepository,
        UserRepository $userRepository,
        BlogPostRepository $blogPostRepository,
    ): Response {
        $orders = $orderRepository->findBy([], ['createdAt' => 'DESC'], 6);
        $revenue = array_sum(array_map(static fn ($o) => $o->getTotal(), $orderRepository->findAll()));

        return $this->render('admin/dashboard.html.twig', [
            'productCount' => $productRepository->count([]),
            'orderCount' => $orderRepository->count([]),
            'userCount' => $userRepository->count([]),
            'postCount' => $blogPostRepository->count([]),
            'revenue' => $revenue,
            'recentOrders' => $orders,
        ]);
    }
}
