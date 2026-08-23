<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\ApiNormalizer;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Inscription publique. La connexion (POST /api/auth/login) est gérée
 * automatiquement par Lexik JWT via json_login — voir security.yaml,
 * aucun contrôleur à écrire pour ça : Lexik répond directement
 * {"token": "..."} sur email/password valides.
 */
#[Route('/api/auth', name: 'api_auth_')]
class AuthController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): never
    {
        throw new \LogicException('Cette route est interceptée par le firewall JSON.');
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        JWTTokenManagerInterface $jwtManager,
        ApiNormalizer $normalizer,
        MailerInterface $mailer,
        string $frontendUrl,
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true) ?? [];

        $email = trim((string) ($payload['email'] ?? ''));
        $password = (string) ($payload['password'] ?? '');
        $firstName = trim((string) ($payload['firstName'] ?? ''));
        $lastName = trim((string) ($payload['lastName'] ?? ''));

        $errors = $validator->validate($email, [new Assert\NotBlank(), new Assert\Email()]);
        if (count($errors) > 0 || '' === $firstName || '' === $lastName) {
            return new JsonResponse(['error' => 'Champs invalides (prénom, nom, email requis).'], 400);
        }

        if (strlen($password) < 8) {
            return new JsonResponse(['error' => 'Le mot de passe doit contenir au moins 8 caractères.'], 400);
        }

        if ($userRepository->findOneByEmail($email)) {
            return new JsonResponse(['error' => 'Un compte existe déjà avec cet email.'], 409);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setFirstName($firstName);
        $user->setLastName($lastName);
        $user->setPhone((string) ($payload['phone'] ?? '') ?: null);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($passwordHasher->hashPassword($user, $password));

        $verificationToken = bin2hex(random_bytes(32));
        $user->setEmailVerificationTokenHash(hash('sha256', $verificationToken));
        $user->setEmailVerificationExpiresAt(new \DateTimeImmutable('+24 hours'));

        $em->persist($user);
        $em->flush();

        $verificationUrl = rtrim($frontendUrl, '/').'/verification-email?token='.urlencode($verificationToken);
        $mailer->send((new Email())
            ->from('no-reply@mhstore.mg')
            ->to($email)
            ->subject('Vérifiez votre adresse email — M&H Store')
            ->text("Bonjour {$firstName},\n\nVérifiez votre adresse email en ouvrant ce lien :\n{$verificationUrl}\n\nCe lien expire dans 24 heures.")
        );

        return new JsonResponse([
            'message' => 'Un email de vérification a été envoyé.',
            'email' => $user->getEmail(),
        ], 202);
    }

    #[Route('/verify-email', name: 'verify_email', methods: ['GET'])]
    public function verifyEmail(Request $request, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $token = trim((string) $request->query->get('token', ''));
        $user = $token === '' ? null : $userRepository->findOneByVerificationTokenHash(hash('sha256', $token));

        if (!$user || !$user->getEmailVerificationExpiresAt() || $user->getEmailVerificationExpiresAt() < new \DateTimeImmutable()) {
            return new JsonResponse(['error' => 'Le lien de vérification est invalide ou expiré.'], 400);
        }

        $user->setEmailVerifiedAt(new \DateTimeImmutable());
        $user->setEmailVerificationTokenHash(null);
        $user->setEmailVerificationExpiresAt(null);
        $em->flush();

        return new JsonResponse(['message' => 'Adresse email vérifiée.']);
    }
}
