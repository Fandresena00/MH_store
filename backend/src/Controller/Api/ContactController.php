<?php

namespace App\Controller\Api;

use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/contact', name: 'api_contact_')]
class ContactController extends AbstractController
{
    #[Route('', name: 'send', methods: ['POST'])]
    public function send(Request $request, ValidatorInterface $validator, LoggerInterface $logger): JsonResponse
    {
        $payload = json_decode($request->getContent(), true) ?? [];

        $name = trim((string) ($payload['name'] ?? ''));
        $email = trim((string) ($payload['email'] ?? ''));
        $message = trim((string) ($payload['message'] ?? ''));

        $errors = $validator->validate($email, [new Assert\NotBlank(), new Assert\Email()]);
        if (count($errors) > 0 || '' === $name || '' === $message) {
            return new JsonResponse(['error' => 'Merci de renseigner votre nom, un email valide et un message.'], 400);
        }

        // TODO : brancher MailerInterface pour un envoi réel vers le support.
        $logger->info('Message de contact reçu', ['name' => $name, 'email' => $email]);

        return new JsonResponse(['status' => 'ok', 'message' => 'Votre message a bien été envoyé, nous revenons vers vous sous 24h.']);
    }
}
