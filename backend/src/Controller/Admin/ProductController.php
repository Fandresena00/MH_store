<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use App\Form\Admin\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin/produits')]
#[IsGranted('ROLE_ADMIN')]
class ProductController extends AbstractController
{
    public function __construct(private readonly string $productUploadDir) {}
    #[Route('', name: 'admin_product_index', methods: ['GET'])]
    public function index(Request $request, ProductRepository $productRepository): Response
    {
        $search = trim((string) $request->query->get('q', ''));
        return $this->render('admin/product/index.html.twig', [
            'products' => $productRepository->findForAdmin($search),
            'search' => $search,
        ]);
    }

    #[Route('/nouveau', name: 'admin_product_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->saveImage($form->get('imageFile')->getData(), $product);
            $em->persist($product);
            $em->flush();
            $this->addFlash('success', 'Produit "'.$product->getName().'" créé.');

            return $this->redirectToRoute('admin_product_index');
        }

        return $this->render('admin/product/form.html.twig', ['form' => $form, 'product' => $product]);
    }

    #[Route('/{id}/modifier', name: 'admin_product_edit', methods: ['GET', 'POST'])]
    public function edit(Product $product, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->saveImage($form->get('imageFile')->getData(), $product);
            $em->flush();
            $this->addFlash('success', 'Produit "'.$product->getName().'" mis à jour.');

            return $this->redirectToRoute('admin_product_index');
        }

        return $this->render('admin/product/form.html.twig', ['form' => $form, 'product' => $product]);
    }

    private function saveImage(?UploadedFile $image, Product $product): void
    {
        if (!$image) return;
        $filename = bin2hex(random_bytes(16)).'.'.$image->guessExtension();
        $image->move($this->productUploadDir, $filename);
        $product->setImagePath('/uploads/products/'.$filename);
    }

    #[Route('/{id}/supprimer', name: 'admin_product_delete', methods: ['POST'])]
    public function delete(Product $product, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete-product-'.$product->getId(), $request->request->get('_token'))) {
            $em->remove($product);
            $em->flush();
            $this->addFlash('success', 'Produit supprimé.');
        }

        return $this->redirectToRoute('admin_product_index');
    }
}
