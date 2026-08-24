<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Category> */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, Category::class); }

    /** @return Category[] */
    public function findForAdmin(?string $search = null): array
    {
        $qb = $this->createQueryBuilder('c')->leftJoin('c.products', 'p')->addSelect('p');
        if ($search) $qb->andWhere('LOWER(c.name) LIKE :search OR LOWER(c.slug) LIKE :search')->setParameter('search', '%'.mb_strtolower($search).'%');
        return $qb->orderBy('c.name', 'ASC')->getQuery()->getResult();
    }
}
