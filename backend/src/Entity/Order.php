<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order
{
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_PREPARING = 'preparing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_IN_TRANSIT = 'in_transit';
    public const STATUS_DELIVERED = 'delivered';

    public const PAYMENT_PENDING = 'pending';
    public const PAYMENT_SUCCESS = 'success';
    public const PAYMENT_FAILED = 'failed';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20, unique: true)]
    private string $reference = '';

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $user = null;

    #[ORM\Column(length: 30)]
    private string $status = self::STATUS_CONFIRMED;

    #[ORM\Column]
    private int $subtotal = 0;

    #[ORM\Column]
    private int $shippingCost = 0;

    #[ORM\Column(length: 20)]
    private string $paymentMethod = 'MVOLA';

    #[ORM\Column(length: 20)]
    private string $paymentStatus = self::PAYMENT_PENDING;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $papiNotificationToken = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $papiPaymentLink = null;

    #[ORM\Column(length: 30, nullable: true)]
    private ?string $trackingNumber = null;

    #[ORM\Column(length: 150)]
    private string $shippingAddress = '';

    #[ORM\Column(length: 100)]
    private string $shippingCity = '';

    #[ORM\Column(length: 180, nullable: true)]
    private ?string $guestEmail = null;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    /** @var Collection<int, OrderItem> */
    #[ORM\OneToMany(targetEntity: OrderItem::class, mappedBy: 'orderEntity', orphanRemoval: true, cascade: ['persist'])]
    private Collection $items;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->items = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getReference(): string { return $this->reference; }
    public function setReference(string $reference): static { $this->reference = $reference; return $this; }
    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): static { $this->user = $user; return $this; }
    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getSubtotal(): int { return $this->subtotal; }
    public function setSubtotal(int $subtotal): static { $this->subtotal = $subtotal; return $this; }
    public function getShippingCost(): int { return $this->shippingCost; }
    public function setShippingCost(int $shippingCost): static { $this->shippingCost = $shippingCost; return $this; }
    public function getTotal(): int { return $this->subtotal + $this->shippingCost; }
    public function getPaymentMethod(): string { return $this->paymentMethod; }
    public function setPaymentMethod(string $paymentMethod): static { $this->paymentMethod = $paymentMethod; return $this; }
    public function getPaymentStatus(): string { return $this->paymentStatus; }
    public function setPaymentStatus(string $paymentStatus): static { $this->paymentStatus = $paymentStatus; return $this; }
    public function getPapiNotificationToken(): ?string { return $this->papiNotificationToken; }
    public function setPapiNotificationToken(?string $papiNotificationToken): static { $this->papiNotificationToken = $papiNotificationToken; return $this; }
    public function getPapiPaymentLink(): ?string { return $this->papiPaymentLink; }
    public function setPapiPaymentLink(?string $papiPaymentLink): static { $this->papiPaymentLink = $papiPaymentLink; return $this; }
    public function getTrackingNumber(): ?string { return $this->trackingNumber; }
    public function setTrackingNumber(?string $trackingNumber): static { $this->trackingNumber = $trackingNumber; return $this; }
    public function getShippingAddress(): string { return $this->shippingAddress; }
    public function setShippingAddress(string $shippingAddress): static { $this->shippingAddress = $shippingAddress; return $this; }
    public function getShippingCity(): string { return $this->shippingCity; }
    public function setShippingCity(string $shippingCity): static { $this->shippingCity = $shippingCity; return $this; }
    public function getGuestEmail(): ?string { return $this->guestEmail; }
    public function setGuestEmail(?string $guestEmail): static { $this->guestEmail = $guestEmail; return $this; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }

    /** @return Collection<int, OrderItem> */
    public function getItems(): Collection { return $this->items; }

    public function addItem(OrderItem $item): static
    {
        if (!$this->items->contains($item)) {
            $this->items->add($item);
            $item->setOrderEntity($this);
        }

        return $this;
    }
}
