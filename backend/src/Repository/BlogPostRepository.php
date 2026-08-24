<?php

namespace App\Repository;

use App\Entity\BlogPost;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<BlogPost> */
class BlogPostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, BlogPost::class); }

    /** @return BlogPost[] */
    public function findAllOrdered(): array
    {
        return $this->createQueryBuilder('b')
            ->orderBy('b.publishedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /** @return BlogPost[] */
    public function findForAdmin(?string $search = null): array
    {
        $qb = $this->createQueryBuilder('b');
        if ($search) $qb->andWhere('LOWER(b.title) LIKE :search OR LOWER(b.category) LIKE :search OR LOWER(b.slug) LIKE :search')->setParameter('search', '%'.mb_strtolower($search).'%');
        return $qb->orderBy('b.publishedAt', 'DESC')->getQuery()->getResult();
    }
}
