<?php

namespace App\Controller\Api;

use App\Repository\CategoryRepository;
use App\Service\ApiNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/categories', name: 'api_categories_')]
class CategoryController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository, ApiNormalizer $normalizer): JsonResponse
    {
        return new JsonResponse([
            'data' => array_map($normalizer->category(...), $categoryRepository->findAll()),
        ]);
    }
}
