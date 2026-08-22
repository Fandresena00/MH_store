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
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        JWTTokenManagerInterface $jwtManager,
        ApiNormalizer $normalizer,
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

        $em->persist($user);
        $em->flush();

        // On délivre directement un JWT à l'inscription, pour éviter à
        // Next.js de devoir enchaîner un second appel de login.
        return new JsonResponse([
            'token' => $jwtManager->create($user),
            'user' => $normalizer->user($user),
        ], 201);
    }
}
