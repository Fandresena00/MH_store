<?php

namespace App\Form\Admin;

use App\Entity\Category;
use App\Entity\Product;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\ColorType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Positive;
use Symfony\Component\Validator\Constraints\Regex;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, ['label' => 'Nom du produit', 'constraints' => [new NotBlank()]])
            ->add('slug', TextType::class, [
                'label' => 'Slug (URL)',
                'attr' => ['placeholder' => 'panier-raphia-tresse'],
                'constraints' => [new NotBlank(), new Regex('/^[a-z0-9]+(-[a-z0-9]+)*$/', message: 'Uniquement minuscules, chiffres et tirets.')],
            ])
            ->add('category', EntityType::class, ['class' => Category::class, 'choice_label' => 'name', 'label' => 'Catégorie'])
            ->add('price', IntegerType::class, ['label' => 'Prix (Ar)', 'constraints' => [new Positive()]])
            ->add('compareAtPrice', IntegerType::class, ['label' => 'Prix barré (Ar) — optionnel', 'required' => false])
            ->add('stock', IntegerType::class, ['label' => 'Stock'])
            ->add('badge', ChoiceType::class, [
                'label' => 'Badge',
                'required' => false,
                'placeholder' => 'Aucun',
                'choices' => ['Nouveau' => 'Nouveau', 'Best-seller' => 'Best-seller', 'Édition limitée' => 'Édition limitée'],
            ])
            ->add('materials', TextType::class, ['label' => 'Matières'])
            ->add('origin', TextType::class, ['label' => 'Origine / atelier'])
            ->add('colorFrom', ColorType::class, ['label' => 'Couleur dégradé (début)'])
            ->add('colorTo', ColorType::class, ['label' => 'Couleur dégradé (fin)'])
            ->add('imageFile', FileType::class, ['label' => 'Photo du produit', 'mapped' => false, 'required' => false, 'attr' => ['accept' => 'image/jpeg,image/png,image/webp']])
            ->add('description', TextareaType::class, ['label' => 'Description', 'attr' => ['rows' => 5]])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => Product::class]);
    }
}
