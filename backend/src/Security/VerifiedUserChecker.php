<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final class VerifiedUserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
    }

    public function checkPostAuth(UserInterface $user, ?TokenInterface $token = null): void
    {
        if ($user instanceof User && !$user->isEmailVerified()) {
            throw new UnverifiedEmailException();
        }
    }
}

final class UnverifiedEmailException extends AccountStatusException
{
    public function getMessageKey(): string
    {
        return 'Votre adresse email doit être vérifiée avant la connexion.';
    }
}
