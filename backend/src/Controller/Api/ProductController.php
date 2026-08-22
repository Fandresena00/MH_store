<?php

namespace App\Controller\Api;

use App\Repository\ProductRepository;
use App\Service\ApiNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/products', name: 'api_products_')]
class ProductController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(Request $request, ProductRepository $productRepository, ApiNormalizer $normalizer): JsonResponse
    {
        $products = $productRepository->search(
            $request->query->get('categorie'),
            $request->query->get('tri', 'recommended'),
        );

        return new JsonResponse([
            'data' => array_map($normalizer->product(...), $products),
            'meta' => ['count' => count($products)],
        ]);
    }

    #[Route('/featured', name: 'featured', methods: ['GET'])]
    public function featured(Request $request, ProductRepository $productRepository, ApiNormalizer $normalizer): JsonResponse
    {
        $limit = min(20, max(1, (int) $request->query->get('limit', 4)));

        return new JsonResponse(['data' => array_map($normalizer->product(...), $productRepository->findFeatured($limit))]);
    }

    #[Route('/{slug}', name: 'show', methods: ['GET'])]
    public function show(string $slug, ProductRepository $productRepository, ApiNormalizer $normalizer): JsonResponse
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);
        if (!$product) {
            return new JsonResponse(['error' => 'Produit introuvable.'], 404);
        }

        $related = $productRepository->findRelated($product, 4);

        return new JsonResponse([
            'data' => $normalizer->product($product, withReviews: true),
            'related' => array_map($normalizer->product(...), $related),
        ]);
    }
}
