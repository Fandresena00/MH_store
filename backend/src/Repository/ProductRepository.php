<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /** @return Product[] */
    public function search(?string $categorySlug, string $sort = 'recommended'): array
    {
        $qb = $this->createQueryBuilder('p')
            ->join('p.category', 'c')
            ->addSelect('c');

        if ($categorySlug) {
            $qb->andWhere('c.slug = :slug')->setParameter('slug', $categorySlug);
        }

        match ($sort) {
            'price_asc' => $qb->orderBy('p.price', 'ASC'),
            'price_desc' => $qb->orderBy('p.price', 'DESC'),
            'newest' => $qb->orderBy('p.createdAt', 'DESC'),
            'rating' => $qb->orderBy('p.rating', 'DESC'),
            default => $qb->orderBy('p.id', 'ASC'),
        };

        return $qb->getQuery()->getResult();
    }

    /** @return Product[] */
    public function findFeatured(int $limit = 4): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.badge IS NOT NULL')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /** @return Product[] */
    public function findRelated(Product $product, int $limit = 4): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.category = :category')
            ->andWhere('p.id != :id')
            ->setParameter('category', $product->getCategory())
            ->setParameter('id', $product->getId())
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
