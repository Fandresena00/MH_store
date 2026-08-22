<?php

namespace App\Entity;

use App\Repository\BlogPostRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BlogPostRepository::class)]
#[ORM\Table(name: 'blog_post')]
class BlogPost
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    private string $title = '';

    #[ORM\Column(length: 200, unique: true)]
    private string $slug = '';

    #[ORM\Column(length: 300)]
    private string $excerpt = '';

    #[ORM\Column(type: 'text')]
    private string $content = '';

    #[ORM\Column(length: 60)]
    private string $category = '';

    #[ORM\Column(length: 7)]
    private string $coverFrom = '#2C5E5F';

    #[ORM\Column(length: 7)]
    private string $coverTo = '#E17A57';

    #[ORM\Column(length: 20)]
    private string $readTime = '5 min';

    #[ORM\Column]
    private \DateTimeImmutable $publishedAt;

    public function __construct() { $this->publishedAt = new \DateTimeImmutable(); }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }
    public function getSlug(): string { return $this->slug; }
    public function setSlug(string $slug): static { $this->slug = $slug; return $this; }
    public function getExcerpt(): string { return $this->excerpt; }
    public function setExcerpt(string $excerpt): static { $this->excerpt = $excerpt; return $this; }
    public function getContent(): string { return $this->content; }
    public function setContent(string $content): static { $this->content = $content; return $this; }
    public function getCategory(): string { return $this->category; }
    public function setCategory(string $category): static { $this->category = $category; return $this; }
    public function getCoverFrom(): string { return $this->coverFrom; }
    public function setCoverFrom(string $coverFrom): static { $this->coverFrom = $coverFrom; return $this; }
    public function getCoverTo(): string { return $this->coverTo; }
    public function setCoverTo(string $coverTo): static { $this->coverTo = $coverTo; return $this; }
    public function getReadTime(): string { return $this->readTime; }
    public function setReadTime(string $readTime): static { $this->readTime = $readTime; return $this; }
    public function getPublishedAt(): \DateTimeImmutable { return $this->publishedAt; }
    public function setPublishedAt(\DateTimeImmutable $publishedAt): static { $this->publishedAt = $publishedAt; return $this; }
}
