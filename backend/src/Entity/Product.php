<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ORM\Table(name: 'product')]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 160)]
    private string $name = '';

    #[ORM\Column(length: 160, unique: true)]
    private string $slug = '';

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    #[ORM\Column]
    private int $price = 0;

    #[ORM\Column(nullable: true)]
    private ?int $compareAtPrice = null;

    #[ORM\Column(type: 'float')]
    private float $rating = 0.0;

    #[ORM\Column]
    private int $reviewsCount = 0;

    #[ORM\Column(length: 255)]
    private string $materials = '';

    #[ORM\Column(length: 160)]
    private string $origin = '';

    #[ORM\Column(length: 7)]
    private string $colorFrom = '#2C5E5F';

    #[ORM\Column(length: 7)]
    private string $colorTo = '#E17A57';

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imagePath = null;

    #[ORM\Column(length: 30, nullable: true)]
    private ?string $badge = null;

    #[ORM\Column(type: 'text')]
    private string $description = '';

    #[ORM\Column]
    private int $stock = 0;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    /** @var Collection<int, Review> */
    #[ORM\OneToMany(targetEntity: Review::class, mappedBy: 'product', orphanRemoval: true)]
    private Collection $reviews;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->reviews = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function setName(string $name): static { $this->name = $name; return $this; }
    public function getSlug(): string { return $this->slug; }
    public function setSlug(string $slug): static { $this->slug = $slug; return $this; }
    public function getCategory(): ?Category { return $this->category; }
    public function setCategory(?Category $category): static { $this->category = $category; return $this; }
    public function getPrice(): int { return $this->price; }
    public function setPrice(int $price): static { $this->price = $price; return $this; }
    public function getCompareAtPrice(): ?int { return $this->compareAtPrice; }
    public function setCompareAtPrice(?int $compareAtPrice): static { $this->compareAtPrice = $compareAtPrice; return $this; }
    public function getRating(): float { return $this->rating; }
    public function setRating(float $rating): static { $this->rating = $rating; return $this; }
    public function getReviewsCount(): int { return $this->reviewsCount; }
    public function setReviewsCount(int $reviewsCount): static { $this->reviewsCount = $reviewsCount; return $this; }
    public function getMaterials(): string { return $this->materials; }
    public function setMaterials(string $materials): static { $this->materials = $materials; return $this; }
    public function getOrigin(): string { return $this->origin; }
    public function setOrigin(string $origin): static { $this->origin = $origin; return $this; }
    public function getColorFrom(): string { return $this->colorFrom; }
    public function setColorFrom(string $colorFrom): static { $this->colorFrom = $colorFrom; return $this; }
    public function getColorTo(): string { return $this->colorTo; }
    public function setColorTo(string $colorTo): static { $this->colorTo = $colorTo; return $this; }
    public function getImagePath(): ?string { return $this->imagePath; }
    public function setImagePath(?string $imagePath): static { $this->imagePath = $imagePath; return $this; }
    public function getBadge(): ?string { return $this->badge; }
    public function setBadge(?string $badge): static { $this->badge = $badge; return $this; }
    public function getDescription(): string { return $this->description; }
    public function setDescription(string $description): static { $this->description = $description; return $this; }
    public function getStock(): int { return $this->stock; }
    public function setStock(int $stock): static { $this->stock = $stock; return $this; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }

    /** @return Collection<int, Review> */
    public function getReviews(): Collection { return $this->reviews; }
}
