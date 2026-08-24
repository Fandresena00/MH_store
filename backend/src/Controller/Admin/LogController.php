<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin/logs')]
#[IsGranted('ROLE_SUPER_ADMIN')]
final class LogController extends AbstractController
{
    #[Route('', name: 'admin_logs', methods: ['GET'])]
    public function index(string $kernelLogsDir): Response
    {
        $path = $kernelLogsDir.'/dev.log';
        $content = is_readable($path) ? file_get_contents($path) : 'Aucun log disponible.';
        $lines = array_slice(explode("\n", (string) $content), -300);
        return $this->render('admin/logs.html.twig', ['lines' => $lines]);
    }
}