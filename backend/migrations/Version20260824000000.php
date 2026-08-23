<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260824000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute la vérification des adresses email utilisateur.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "user" ADD email_verified_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD email_verification_token_hash VARCHAR(64) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD email_verification_expires_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_USER_VERIFICATION_TOKEN ON "user" (email_verification_token_hash)');
        $this->addSql("UPDATE \"user\" SET email_verified_at = NOW() WHERE roles::text LIKE '%ROLE_ADMIN%'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX UNIQ_USER_VERIFICATION_TOKEN');
        $this->addSql('ALTER TABLE "user" DROP email_verified_at');
        $this->addSql('ALTER TABLE "user" DROP email_verification_token_hash');
        $this->addSql('ALTER TABLE "user" DROP email_verification_expires_at');
    }
}
