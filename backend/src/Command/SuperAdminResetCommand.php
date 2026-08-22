<?php

namespace App\Command;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[AsCommand(
    name: 'app:super-admin:reset',
    description: 'Change l\'email et/ou le mot de passe du super admin unique (nécessite le code de override).',
)]
class SuperAdminResetCommand extends Command
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidatorInterface $validator,
        private readonly string $superAdminOverrideCode,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('override-code', null, InputOption::VALUE_REQUIRED, 'Code de override (SUPER_ADMIN_OVERRIDE_CODE)')
            ->addOption('email', null, InputOption::VALUE_OPTIONAL, 'Nouvelle adresse email')
            ->addOption('password', null, InputOption::VALUE_OPTIONAL, 'Nouveau mot de passe')
            ->setHelp('Modifie UNIQUEMENT le super administrateur unique. Nécessite SUPER_ADMIN_OVERRIDE_CODE (secret d\'exploitation distinct du mot de passe, à définir dans .env.local, jamais commité).')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('M&H Store — Réinitialisation du super administrateur');

        if (empty($this->superAdminOverrideCode) || 'change_me' === $this->superAdminOverrideCode) {
            $io->error('SUPER_ADMIN_OVERRIDE_CODE n\'est pas configuré (ou a encore sa valeur par défaut). Définissez une valeur secrète avant d\'utiliser cette commande.');

            return Command::FAILURE;
        }

        $providedCode = (string) $input->getOption('override-code');
        if ('' === $providedCode || !hash_equals($this->superAdminOverrideCode, $providedCode)) {
            $io->error('Code de override invalide.');

            return Command::FAILURE;
        }

        $superAdmin = $this->userRepository->findSuperAdmin();
        if (!$superAdmin) {
            $io->error(['Aucun super administrateur trouvé.', 'Utilisez plutôt : php bin/console app:super-admin:create']);

            return Command::FAILURE;
        }

        $newEmail = $input->getOption('email');
        $newPassword = $input->getOption('password');

        if (!$newEmail && !$newPassword) {
            $io->error('Précisez au moins --email ou --password.');

            return Command::FAILURE;
        }

        $changes = [];

        if ($newEmail) {
            $violations = $this->validator->validate($newEmail, [new Email()]);
            if (0 !== count($violations)) {
                $io->error('Adresse email invalide.');

                return Command::FAILURE;
            }

            $conflict = $this->userRepository->findOneByEmail($newEmail);
            if ($conflict && $conflict->getId() !== $superAdmin->getId()) {
                $io->error('Un autre compte utilise déjà cet email.');

                return Command::FAILURE;
            }

            $superAdmin->setEmail($newEmail);
            $changes[] = 'email → '.$newEmail;
        }

        if ($newPassword) {
            if (strlen($newPassword) < 12) {
                $io->error('Le mot de passe doit contenir au moins 12 caractères.');

                return Command::FAILURE;
            }

            $superAdmin->setPassword($this->passwordHasher->hashPassword($superAdmin, $newPassword));
            $changes[] = 'mot de passe mis à jour';
        }

        if (!$io->confirm('Confirmer les changements suivants : '.implode(', ', $changes).' ?', false)) {
            $io->comment('Opération annulée.');

            return Command::SUCCESS;
        }

        $this->em->flush();
        $io->success('Super administrateur mis à jour : '.implode(', ', $changes));

        return Command::SUCCESS;
    }
}
