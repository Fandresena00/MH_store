<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:admin:sync', description: 'Synchronise les comptes admin depuis ADMIN_USERS_JSON.')]
final class AdminSyncCommand extends Command
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $hasher,
        private readonly string $adminUsersJson,
    ) { parent::__construct(); }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $configured = json_decode($this->adminUsersJson, true);
        if (!is_array($configured)) {
            $io->error('ADMIN_USERS_JSON doit être un tableau JSON valide.');
            return Command::FAILURE;
        }

        foreach ($configured as $data) {
            $email = strtolower(trim((string) ($data['email'] ?? '')));
            $role = ($data['role'] ?? 'ROLE_ADMIN') === 'ROLE_SUPER_ADMIN' ? 'ROLE_SUPER_ADMIN' : 'ROLE_ADMIN';
            if ($email === '' || strlen((string) ($data['password'] ?? '')) < 12) {
                $io->error('Chaque admin doit avoir un email et un mot de passe d’au moins 12 caractères.');
                return Command::FAILURE;
            }
            $user = $this->users->findOneByEmail($email) ?? new User();
            $user->setEmail($email)->setFirstName((string) ($data['firstName'] ?? 'Admin'))->setLastName((string) ($data['lastName'] ?? ''))->setRoles([$role])->setEmailVerifiedAt(new \DateTimeImmutable());
            $user->setPassword($this->hasher->hashPassword($user, (string) $data['password']));
            $this->em->persist($user);
            $io->text("Synchronisé: {$email} ({$role})");
        }
        $this->em->flush();
        $io->success('Comptes admin synchronisés depuis ADMIN_USERS_JSON.');
        return Command::SUCCESS;
    }
}