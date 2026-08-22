<?php

namespace App\Form\Admin;

use App\Entity\BlogPost;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class BlogPostType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, ['label' => 'Titre', 'constraints' => [new NotBlank()]])
            ->add('slug', TextType::class, ['label' => 'Slug (URL)', 'constraints' => [new NotBlank()]])
            ->add('category', TextType::class, ['label' => 'Catégorie'])
            ->add('excerpt', TextareaType::class, ['label' => 'Extrait', 'attr' => ['rows' => 2]])
            ->add('content', TextareaType::class, ['label' => 'Contenu', 'attr' => ['rows' => 8]])
            ->add('readTime', TextType::class, ['label' => 'Temps de lecture', 'attr' => ['placeholder' => '6 min']])
            ->add('coverFrom', TextType::class, ['label' => 'Couverture — couleur début', 'attr' => ['type' => 'color']])
            ->add('coverTo', TextType::class, ['label' => 'Couverture — couleur fin', 'attr' => ['type' => 'color']])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(['data_class' => BlogPost::class]);
    }
}
