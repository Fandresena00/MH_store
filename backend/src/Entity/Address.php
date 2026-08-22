<?php

namespace App\Entity;

use App\Repository\AddressRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AddressRepository::class)]
#[ORM\Table(name: 'address')]
class Address
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'addresses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 60)]
    private string $label = '';

    #[ORM\Column(length: 150)]
    private string $fullName = '';

    #[ORM\Column(length: 255)]
    private string $line1 = '';

    #[ORM\Column(length: 100)]
    private string $city = '';

    #[ORM\Column(length: 30)]
    private string $phone = '';

    public function getId(): ?int { return $this->id; }
    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): static { $this->user = $user; return $this; }
    public function getLabel(): string { return $this->label; }
    public function setLabel(string $label): static { $this->label = $label; return $this; }
    public function getFullName(): string { return $this->fullName; }
    public function setFullName(string $fullName): static { $this->fullName = $fullName; return $this; }
    public function getLine1(): string { return $this->line1; }
    public function setLine1(string $line1): static { $this->line1 = $line1; return $this; }
    public function getCity(): string { return $this->city; }
    public function setCity(string $city): static { $this->city = $city; return $this; }
    public function getPhone(): string { return $this->phone; }
    public function setPhone(string $phone): static { $this->phone = $phone; return $this; }
}
