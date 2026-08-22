<?php

namespace App\Controller\Api;

use App\Repository\BlogPostRepository;
use App\Service\ApiNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/blog', name: 'api_blog_')]
class BlogController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(BlogPostRepository $blogPostRepository, ApiNormalizer $normalizer): JsonResponse
    {
        return new JsonResponse([
            'data' => array_map($normalizer->blogPost(...), $blogPostRepository->findAllOrdered()),
        ]);
    }

    #[Route('/{slug}', name: 'show', methods: ['GET'])]
    public function show(string $slug, BlogPostRepository $blogPostRepository, ApiNormalizer $normalizer): JsonResponse
    {
        $post = $blogPostRepository->findOneBy(['slug' => $slug]);
        if (!$post) {
            return new JsonResponse(['error' => 'Article introuvable.'], 404);
        }

        $others = array_filter($blogPostRepository->findAllOrdered(), static fn ($p) => $p->getSlug() !== $slug);

        return new JsonResponse([
            'data' => $normalizer->blogPost($post),
            'others' => array_map($normalizer->blogPost(...), array_slice($others, 0, 2)),
        ]);
    }
}
