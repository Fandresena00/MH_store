<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Service\ApiNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class MeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function __invoke(ApiNormalizer $normalizer): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return new JsonResponse(['data' => $normalizer->user($user)]);
    }
}
