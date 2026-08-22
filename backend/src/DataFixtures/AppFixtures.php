<?php

namespace App\DataFixtures;

use App\Entity\BlogPost;
use App\Entity\Category;
use App\Entity\Product;
use App\Entity\Review;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private readonly UserPasswordHasherInterface $passwordHasher)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $categories = [];
        foreach (['Maison' => 'maison', 'Textile' => 'textile', 'Accessoires' => 'accessoires'] as $name => $slug) {
            $category = new Category();
            $category->setName($name);
            $category->setSlug($slug);
            $manager->persist($category);
            $categories[$slug] = $category;
        }

        $productData = [
            ['panier-raphia-tresse', 'Panier en raphia tressé', 'maison', 68000, 82000, 4.8, 34, 'Raphia naturel, cuir végétal', 'Tissé à Ambalavao', '#D9B98A', '#8A6D3B', 'Best-seller', "Tressé à la main par des artisanes d'Ambalavao selon une technique transmise sur trois générations.", 14],
            ['plaid-lamba-coton', 'Plaid Lamba en coton brossé', 'textile', 94000, null, 4.9, 51, 'Coton brossé 100%, teinture végétale', 'Tissé à Antsirabe', '#B5533F', '#2C6E6B', 'Nouveau', 'Réinterprétation contemporaine du lamba traditionnel malgache, tissé sur métier à pédale.', 22],
            ['bol-bois-palissandre', 'Bol en bois de palissandre', 'maison', 45000, null, 4.7, 19, 'Palissandre issu de replantation certifiée', 'Sculpté à Ambositra', '#5A3B28', '#2B1C12', null, "Tourné à la main dans un atelier d'Ambositra, ville réputée pour son artisanat du bois.", 31],
            ['sac-cabas-cuir-raphia', 'Cabas cuir & raphia', 'accessoires', 132000, 149000, 4.6, 27, 'Cuir pleine fleur, raphia tressé', 'Assemblé à Antananarivo', '#8A5A3B', '#D9B98A', 'Édition limitée', 'Structure en cuir pleine fleur tannée localement, corps tressé main.', 8],
            ['coussin-brode-zebu', 'Coussin brodé motif zébu', 'textile', 52000, null, 4.5, 12, 'Lin, broderie fil de soie', 'Brodé à Fianarantsoa', '#2C6E6B', '#E17A57', null, 'Broderie représentant le zébu, symbole de prospérité à Madagascar.', 40],
            ['vannerie-suspension', 'Suspension en vannerie', 'maison', 76000, null, 4.9, 9, 'Fibre de raphia, armature métal', 'Tissé à Ambalavao', '#D9B98A', '#5A3B28', 'Nouveau', 'Diffuse une lumière chaleureuse et tramée.', 17],
            ['etole-soie-sauvage', 'Étole en soie sauvage', 'textile', 88000, null, 4.8, 22, 'Soie sauvage Landibe', 'Filée à Soatanana', '#E17A57', '#B5533F', null, 'Filée à partir du landibe, ver à soie endémique des hauts plateaux.', 11],
            ['plateau-corne-zebu', 'Plateau en corne de zébu', 'maison', 39000, null, 4.4, 15, 'Corne de zébu polie, sous-produit valorisé', 'Façonné à Antsirabe', '#3B2A1E', '#8A6D3B', null, 'Chaque plateau valorise une corne de zébu issue de la filière alimentaire locale.', 26],
        ];

        $products = [];
        foreach ($productData as $row) {
            [$slug, $name, $catSlug, $price, $compareAt, $rating, $reviewsCount, $materials, $origin, $colorFrom, $colorTo, $badge, $description, $stock] = $row;

            $product = new Product();
            $product->setSlug($slug);
            $product->setName($name);
            $product->setCategory($categories[$catSlug]);
            $product->setPrice($price);
            $product->setCompareAtPrice($compareAt);
            $product->setRating($rating);
            $product->setReviewsCount($reviewsCount);
            $product->setMaterials($materials);
            $product->setOrigin($origin);
            $product->setColorFrom($colorFrom ?: '#2C5E5F');
            $product->setColorTo($colorTo);
            $product->setBadge($badge);
            $product->setDescription($description);
            $product->setStock($stock);
            $manager->persist($product);
            $products[$slug] = $product;
        }

        $reviewData = [
            ['panier-raphia-tresse', 'Hanta R.', 5, 'La qualité de tressage est bluffante, on sent le travail artisanal dans chaque détail.'],
            ['plaid-lamba-coton', 'Mihaja A.', 5, 'Le plaid est encore plus beau en vrai. Les couleurs végétales donnent une profondeur incomparable.'],
            ['sac-cabas-cuir-raphia', 'Sitraka L.', 4, 'Très satisfaite du cabas, le cuir est souple et le raphia bien serré.'],
        ];
        foreach ($reviewData as [$slug, $author, $rating, $text]) {
            $review = new Review();
            $review->setProduct($products[$slug]);
            $review->setAuthor($author);
            $review->setRating($rating);
            $review->setText($text);
            $manager->persist($review);
        }

        $postData = [
            ['artisanat-ambalavao-raphia', "À Ambalavao, le geste du tressage se transmet encore de mère en fille", 'Savoir-faire', '#D9B98A', '#8A6D3B', '6 min'],
            ['teintures-vegetales-madagascar', 'Le retour des teintures végétales dans le textile malgache', 'Matières', '#2C6E6B', '#B5533F', '8 min'],
            ['guide-entretien-raphia', 'Comment entretenir vos objets en raphia pour les faire durer', 'Guides', '#E17A57', '#D9B98A', '4 min'],
        ];
        foreach ($postData as [$slug, $title, $category, $from, $to, $readTime]) {
            $post = new BlogPost();
            $post->setSlug($slug);
            $post->setTitle($title);
            $post->setExcerpt("Reportage et carnet sur l'artisanat malgache et les mains qui le font vivre.");
            $post->setContent("Dans cet atelier, le rythme reste dicté par la main plutôt que par la machine.\n\nC'est cette lenteur assumée que M&H Store choisit de mettre en avant.");
            $post->setCategory($category);
            $post->setCoverFrom($from);
            $post->setCoverTo($to);
            $post->setReadTime($readTime);
            $manager->persist($post);
        }

        $admin = new User();
        $admin->setEmail('admin@mhstore.mg');
        $admin->setFirstName('Mialy');
        $admin->setLastName('Rakoto');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'ChangeMoi123!'));
        $manager->persist($admin);

        $customer = new User();
        $customer->setEmail('hanta@example.com');
        $customer->setFirstName('Hanta');
        $customer->setLastName('Ravalison');
        $customer->setRoles(['ROLE_USER']);
        $customer->setPassword($this->passwordHasher->hashPassword($customer, 'ChangeMoi123!'));
        $manager->persist($customer);

        $manager->flush();
    }
}
