<?php

namespace App\Controller\Admin;

use App\Entity\BlogPost;
use App\Form\Admin\BlogPostType;
use App\Repository\BlogPostRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin/articles')]
#[IsGranted('ROLE_ADMIN')]
class BlogPostController extends AbstractController
{
    #[Route('', name: 'admin_blog_index', methods: ['GET'])]
    public function index(Request $request, BlogPostRepository $blogPostRepository): Response
    {
        $search = trim((string) $request->query->get('q', ''));
        return $this->render('admin/blog/index.html.twig', ['posts' => $blogPostRepository->findForAdmin($search), 'search' => $search]);
    }

    #[Route('/nouveau', name: 'admin_blog_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $post = new BlogPost();
        $form = $this->createForm(BlogPostType::class, $post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($post);
            $em->flush();
            $this->addFlash('success', 'Article publié.');

            return $this->redirectToRoute('admin_blog_index');
        }

        return $this->render('admin/blog/form.html.twig', ['form' => $form, 'post' => $post]);
    }

    #[Route('/{id}/modifier', name: 'admin_blog_edit', methods: ['GET', 'POST'])]
    public function edit(BlogPost $post, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(BlogPostType::class, $post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Article mis à jour.');

            return $this->redirectToRoute('admin_blog_index');
        }

        return $this->render('admin/blog/form.html.twig', ['form' => $form, 'post' => $post]);
    }

    #[Route('/{id}/supprimer', name: 'admin_blog_delete', methods: ['POST'])]
    public function delete(BlogPost $post, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete-post-'.$post->getId(), $request->request->get('_token'))) {
            $em->remove($post);
            $em->flush();
            $this->addFlash('success', 'Article supprimé.');
        }

        return $this->redirectToRoute('admin_blog_index');
    }
}
