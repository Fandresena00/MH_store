<?php

namespace App\Controller\Api;

use App\Entity\Address;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/account', name: 'api_account_')]
#[IsGranted('ROLE_USER')]
class AccountController extends AbstractController
{
    #[Route('', name: 'show', methods: ['GET'])]
    public function show(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return new JsonResponse(['data' => $this->userData($user)]);
    }

    #[Route('', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $payload = json_decode($request->getContent(), true) ?? [];
        $firstName = trim((string) ($payload['firstName'] ?? ''));
        $lastName = trim((string) ($payload['lastName'] ?? ''));

        if ($firstName === '' || $lastName === '') {
            return new JsonResponse(['error' => 'Le prénom et le nom sont obligatoires.'], 400);
        }

        $user->setFirstName($firstName);
        $user->setLastName($lastName);
        $user->setPhone(trim((string) ($payload['phone'] ?? '')) ?: null);
        $em->flush();

        return new JsonResponse(['data' => $this->userData($user)]);
    }

    #[Route('/addresses', name: 'addresses_create', methods: ['POST'])]
    public function createAddress(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $payload = json_decode($request->getContent(), true) ?? [];
        $address = new Address();
        $this->fillAddress($address, $payload);
        if ($this->addressIsInvalid($address)) {
            return new JsonResponse(['error' => 'Tous les champs de l’adresse sont obligatoires.'], 400);
        }

        $address->setUser($user);
        $em->persist($address);
        $em->flush();

        return new JsonResponse(['data' => $this->addressData($address)], 201);
    }

    #[Route('/addresses/{id}', name: 'addresses_update', methods: ['PUT', 'PATCH'])]
    public function updateAddress(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $address = $this->ownedAddress($id);
        if (!$address) {
            return new JsonResponse(['error' => 'Adresse introuvable.'], 404);
        }

        $this->fillAddress($address, json_decode($request->getContent(), true) ?? []);
        if ($this->addressIsInvalid($address)) {
            return new JsonResponse(['error' => 'Tous les champs de l’adresse sont obligatoires.'], 400);
        }
        $em->flush();

        return new JsonResponse(['data' => $this->addressData($address)]);
    }

    #[Route('/addresses/{id}', name: 'addresses_delete', methods: ['DELETE'])]
    public function deleteAddress(int $id, EntityManagerInterface $em): JsonResponse
    {
        $address = $this->ownedAddress($id);
        if (!$address) {
            return new JsonResponse(['error' => 'Adresse introuvable.'], 404);
        }

        $em->remove($address);
        $em->flush();

        return new JsonResponse(status: 204);
    }

    private function ownedAddress(int $id): ?Address
    {
        /** @var User $user */
        $user = $this->getUser();
        foreach ($user->getAddresses() as $address) {
            if ($address->getId() === $id) {
                return $address;
            }
        }

        return null;
    }

    private function fillAddress(Address $address, array $payload): void
    {
        $address->setLabel(trim((string) ($payload['label'] ?? '')));
        $address->setFullName(trim((string) ($payload['fullName'] ?? '')));
        $address->setLine1(trim((string) ($payload['line1'] ?? '')));
        $address->setCity(trim((string) ($payload['city'] ?? '')));
        $address->setPhone(trim((string) ($payload['phone'] ?? '')));
    }

    private function addressIsInvalid(Address $address): bool
    {
        return $address->getLabel() === '' || $address->getFullName() === '' || $address->getLine1() === '' || $address->getCity() === '' || $address->getPhone() === '';
    }

    private function userData(User $user): array
    {
        return [
            'fullName' => $user->getFullName(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'phone' => $user->getPhone(),
            'createdAt' => $user->getCreatedAt()->format(DATE_ATOM),
            'addresses' => array_map($this->addressData(...), $user->getAddresses()->toArray()),
        ];
    }

    private function addressData(Address $address): array
    {
        return [
            'id' => $address->getId(),
            'label' => $address->getLabel(),
            'fullName' => $address->getFullName(),
            'line1' => $address->getLine1(),
            'city' => $address->getCity(),
            'phone' => $address->getPhone(),
        ];
    }
}
