<?php

namespace App\Service;

use App\Entity\BlogPost;
use App\Entity\Category;
use App\Entity\Order;
use App\Entity\Product;
use App\Entity\Review;
use App\Entity\User;

/**
 * Transforme les entités Doctrine en tableaux prêts pour JsonResponse.
 * Volontairement manuel (pas le Serializer component) : le format exposé
 * au frontend Next.js doit rester stable et explicite, indépendamment de
 * la structure interne des entités.
 */
class ApiNormalizer
{
    public function category(Category $category): array
    {
        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'productCount' => $category->getProducts()->count(),
        ];
    }

    public function product(Product $product, bool $withReviews = false): array
    {
        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'slug' => $product->getSlug(),
            'category' => [
                'id' => $product->getCategory()?->getId(),
                'name' => $product->getCategory()?->getName(),
                'slug' => $product->getCategory()?->getSlug(),
            ],
            'price' => $product->getPrice(),
            'compareAtPrice' => $product->getCompareAtPrice(),
            'rating' => $product->getRating(),
            'reviewsCount' => $product->getReviewsCount(),
            'materials' => $product->getMaterials(),
            'origin' => $product->getOrigin(),
            'colorFrom' => $product->getColorFrom(),
            'colorTo' => $product->getColorTo(),
            'image' => $product->getImagePath(),
            'badge' => $product->getBadge(),
            'description' => $product->getDescription(),
            'stock' => $product->getStock(),
        ];

        if ($withReviews) {
            $data['reviews'] = array_map($this->review(...), $product->getReviews()->toArray());
        }

        return $data;
    }

    public function review(Review $review): array
    {
        return [
            'id' => $review->getId(),
            'author' => $review->getAuthor(),
            'rating' => $review->getRating(),
            'text' => $review->getText(),
            'createdAt' => $review->getCreatedAt()->format(DATE_ATOM),
        ];
    }

    public function blogPost(BlogPost $post): array
    {
        return [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'slug' => $post->getSlug(),
            'excerpt' => $post->getExcerpt(),
            'content' => $post->getContent(),
            'category' => $post->getCategory(),
            'coverFrom' => $post->getCoverFrom(),
            'coverTo' => $post->getCoverTo(),
            'readTime' => $post->getReadTime(),
            'publishedAt' => $post->getPublishedAt()->format(DATE_ATOM),
        ];
    }

    public function order(Order $order, bool $withItems = true): array
    {
        $data = [
            'reference' => $order->getReference(),
            'status' => $order->getStatus(),
            'paymentStatus' => $order->getPaymentStatus(),
            'paymentMethod' => $order->getPaymentMethod(),
            'subtotal' => $order->getSubtotal(),
            'shippingCost' => $order->getShippingCost(),
            'total' => $order->getTotal(),
            'trackingNumber' => $order->getTrackingNumber(),
            'shippingAddress' => $order->getShippingAddress(),
            'shippingCity' => $order->getShippingCity(),
            'createdAt' => $order->getCreatedAt()->format(DATE_ATOM),
        ];

        if ($withItems) {
            $data['items'] = array_map(
                fn ($item) => [
                    'product' => $this->product($item->getProduct()),
                    'quantity' => $item->getQuantity(),
                    'unitPrice' => $item->getUnitPrice(),
                    'lineTotal' => $item->getLineTotal(),
                ],
                $order->getItems()->toArray()
            );
        }

        return $data;
    }

    public function user(User $user): array
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'fullName' => $user->getFullName(),
            'phone' => $user->getPhone(),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()->format(DATE_ATOM),
        ];
    }
}
