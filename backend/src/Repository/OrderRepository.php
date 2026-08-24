<?php

namespace App\Repository;

use App\Entity\Order;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Order> */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, Order::class); }

    /** @return Order[] */
    public function findForUser(User $user): array
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.user = :user')
            ->setParameter('user', $user)
            ->orderBy('o.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findOneByReference(string $reference): ?Order { return $this->findOneBy(['reference' => $reference]); }

    /** @return Order[] */
    public function findForAdmin(?string $search = null, ?string $status = null): array
    {
        $qb = $this->createQueryBuilder('o')->leftJoin('o.user', 'u')->addSelect('u');
        if ($search) $qb->andWhere('LOWER(o.reference) LIKE :search OR LOWER(o.guestEmail) LIKE :search OR LOWER(u.email) LIKE :search')->setParameter('search', '%'.mb_strtolower($search).'%');
        if ($status) $qb->andWhere('o.status = :status')->setParameter('status', $status);
        return $qb->orderBy('o.createdAt', 'DESC')->getQuery()->getResult();
    }
}
