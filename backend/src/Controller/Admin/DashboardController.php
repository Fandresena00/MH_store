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
        $allOrders = $orderRepository->findAll();
        $revenue = array_sum(array_map(static fn ($o) => $o->getTotal(), $allOrders));

        return $this->render('admin/dashboard.html.twig', [
            'productCount' => $productRepository->count([]),
            'orderCount' => $orderRepository->count([]),
            'userCount' => $userRepository->count([]),
            'postCount' => $blogPostRepository->count([]),
            'revenue' => $revenue,
            'recentOrders' => $orders,
            'charts' => $this->charts($allOrders),
        ]);
    }

    private function charts(array $orders): array
    {
        $now = new \DateTimeImmutable('today');
        $groups = [
            'jours' => ['title' => 'Ventes par jour', 'values' => []],
            'semaines' => ['title' => 'Ventes par semaine', 'values' => []],
            'mois' => ['title' => 'Ventes par mois', 'values' => []],
            'annees' => ['title' => 'Ventes par année', 'values' => []],
        ];
        for ($i = 6; $i >= 0; --$i) $groups['jours']['values'][$now->modify("-{$i} days")->format('d/m')] = 0;
        for ($i = 11; $i >= 0; --$i) $groups['semaines']['values']['S-'.$now->modify("-{$i} weeks")->format('W')] = 0;
        for ($i = 11; $i >= 0; --$i) $groups['mois']['values'][$now->modify("-{$i} months")->format('m/Y')] = 0;
        for ($i = 2; $i >= 0; --$i) $groups['annees']['values'][$now->modify("-{$i} years")->format('Y')] = 0;

        foreach ($orders as $order) {
            $date = $order->getCreatedAt();
            $keys = [$date->format('d/m'), 'S-'.$date->format('W'), $date->format('m/Y'), $date->format('Y')];
            foreach (array_keys($groups) as $index => $group) {
                if (array_key_exists($keys[$index], $groups[$group]['values'])) $groups[$group]['values'][$keys[$index]] += $order->getTotal();
            }
        }
        foreach ($groups as &$group) {
            $group['max'] = max(array_merge([1], array_values($group['values'])));
        }
        return $groups;
    }
}
