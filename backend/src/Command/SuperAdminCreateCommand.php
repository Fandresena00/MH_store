<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[AsCommand(
    name: 'app:super-admin:create',
    description: 'Crée le super administrateur unique de M&H Store (échoue si un super admin existe déjà).',
)]
class SuperAdminCreateCommand extends Command
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidatorInterface $validator,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('email', null, InputOption::VALUE_REQUIRED, 'Adresse email du super admin')
            ->addOption('password', null, InputOption::VALUE_REQUIRED, 'Mot de passe du super admin')
            ->addOption('first-name', null, InputOption::VALUE_REQUIRED, 'Prénom', 'Super')
            ->addOption('last-name', null, InputOption::VALUE_REQUIRED, 'Nom', 'Admin')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('M&H Store — Création du super administrateur');

        $existing = $this->userRepository->findSuperAdmin();
        if ($existing) {
            $io->error([
                'Un super administrateur existe déjà : '.$existing->getEmail(),
                'Le super admin est unique. Utilisez plutôt :',
                '  php bin/console app:super-admin:reset --override-code=<code> [--email=...] [--password=...]',
            ]);

            return Command::FAILURE;
        }

        $email = $input->getOption('email');
        if (!$email) {
            $email = $io->askQuestion(new Question('Adresse email du super admin : '));
        }

        $violations = $this->validator->validate($email, [new Email()]);
        if (0 !== count($violations) || !$email) {
            $io->error('Adresse email invalide.');

            return Command::FAILURE;
        }

        if ($this->userRepository->findOneByEmail($email)) {
            $io->error('Un compte existe déjà avec cet email.');

            return Command::FAILURE;
        }

        $password = $input->getOption('password');
        if (!$password) {
            $question = new Question('Mot de passe du super admin (min. 12 caractères) : ');
            $question->setHidden(true);
            $question->setHiddenFallback(false);
            $password = $io->askQuestion($question);
        }

        if (!$password || strlen($password) < 12) {
            $io->error('Le mot de passe doit contenir au moins 12 caractères.');

            return Command::FAILURE;
        }

        $user = new User();
        $user->setEmail($email);
        $user->setFirstName($input->getOption('first-name'));
        $user->setLastName($input->getOption('last-name'));
        $user->setRoles(['ROLE_SUPER_ADMIN']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));

        $this->em->persist($user);
        $this->em->flush();

        $io->success(['Super administrateur créé avec succès.', 'Email : '.$email]);
        $io->warning('Conservez ces identifiants en lieu sûr — ce compte ne peut être modifié que via app:super-admin:reset et son code de override.');

        return Command::SUCCESS;
    }
}
