<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Schéma initial M&H Store — PostgreSQL. Backend API (Symfony) + admin,
 * consommé par un frontend Next.js découplé.
 */
final class Version20260818000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Schéma initial M&H Store : catalogue, comptes, commandes (+ paiement PAPI), blog.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            CREATE TABLE category (
                id SERIAL NOT NULL,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) NOT NULL,
                PRIMARY KEY(id)
            )
        SQL);
        $this->addSql('CREATE UNIQUE INDEX UNIQ_64C19C1989D9B62 ON category (slug)');

        $this->addSql(<<<'SQL'
            CREATE TABLE product (
                id SERIAL NOT NULL,
                category_id INT NOT NULL,
                name VARCHAR(160) NOT NULL,
                slug VARCHAR(160) NOT NULL,
                price INT NOT NULL,
                compare_at_price INT DEFAULT NULL,
                rating DOUBLE PRECISION NOT NULL,
                reviews_count INT NOT NULL,
                materials VARCHAR(255) NOT NULL,
                origin VARCHAR(160) NOT NULL,
                color_from VARCHAR(7) NOT NULL,
                color_to VARCHAR(7) NOT NULL,
                badge VARCHAR(30) DEFAULT NULL,
                description TEXT NOT NULL,
                stock INT NOT NULL,
                created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
                PRIMARY KEY(id)
            )
        SQL);
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04ADA23B42D ON product (slug)');
        $this->addSql('CREATE INDEX IDX_D34A04AD12469DE2 ON product (category_id)');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        $this->addSql(<<<'SQL'
            CREATE TABLE review (
                id SERIAL NOT NULL,
                product_id INT NOT NULL,
                author VARCHAR(120) NOT NULL,
                rating INT NOT NULL,
                text TEXT NOT NULL,
                created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
                PRIMARY KEY(id)
            )
        SQL);
        $this->addSql('CREATE INDEX IDX_794381C64584665A ON review (product_id)');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C64584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        $this->addSql(<<<'SQL'
            CREATE TABLE blog_post (
                id SERIAL NOT NULL,
                title VARCHAR(200) NOT NULL,
                slug VARCHAR(200) NOT NULL,
                excerpt VARCHAR(300) NOT NULL,
                content TEXT NOT NULL,
                category VARCHAR(60) NOT NULL,
                cover_from VARCHAR(7) NOT NULL,
                cover_to VARCHAR(7) NOT NULL,
                read_time VARCHAR(20) NOT NULL,
                published_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
                PRIMARY KEY(id)
            )
        SQL);
        $this->addSql('CREATE UNIQUE INDEX UNIQ_BA5AE01E989D9B62 ON blog_post (slug)');

        $this->addSql(<<<'SQL'
            CREATE TABLE "user" (
                id SERIAL NOT NULL,
                email VARCHAR(180) NOT NULL,
                roles JSON NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone VARCHAR(30) DEFAULT NULL,
                created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
                PRIMARY KEY(id)
            )
        SQL);
        $this->addSql('CREATE UNIQUE INDEX UNIQ_USER_EMAIL ON "user" (email)');

        $this->addSql(<<<'SQL'
            CREATE TABLE address (
                id SERIAL NOT NULL,
                user_id INT NOT NULL,
                label VARCHAR(60) NOT NULL,
                full_name VARCHAR(150) NOT NULL,
                line1 VARCHAR(255) NOT NULL,
                city VARCHAR(100) NOT NULL,
                phone VARCHAR(30) NOT NULL,
                PRIMARY KEY(id)
            )
        SQL);
        $this->addSql('CREATE INDEX IDX_D4E6F81A76ED395 ON address (user_id)');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F81A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        $this->addSql(<<<'SQL'
            CREATE TABLE "order" (
                id SERIAL NOT NULL,
                user_id INT DEFAULT NULL,
                reference VARCHAR(20) NOT NULL,
                status VARCHAR(30) NOT NULL,
                subtotal INT NOT NULL,
                shipping_cost INT NOT NULL,
                payment_method VARCHAR(20) NOT NULL,
                payment_status VARCHAR(20) NOT NULL,
                papi_notification_token VARCHAR(100) DEFAULT NULL,
                papi_payment_link TEXT DEFAULT NULL,
                tracking_number VARCHAR(30) DEFAULT NULL,
                shipping_address VARCHAR(150) NOT NULL,
                shipping_city VARCHAR(100) NOT NULL,
                guest_email VARCHAR(180) DEFAULT NULL,
                created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
                PRIMARY KEY(id)
            )
        SQL);
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F5299398AEA34913 ON "order" (reference)');
        $this->addSql('CREATE INDEX IDX_F5299398A76ED395 ON "order" (user_id)');
        $this->addSql('ALTER TABLE "order" ADD CONSTRAINT FK_F5299398A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        $this->addSql(<<<'SQL'
            CREATE TABLE order_item (
                id SERIAL NOT NULL,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                unit_price INT NOT NULL,
                PRIMARY KEY(id)
            )
        SQL);
        $this->addSql('CREATE INDEX IDX_52EA1F098D9F6D38 ON order_item (order_id)');
        $this->addSql('CREATE INDEX IDX_52EA1F094584665A ON order_item (product_id)');
        $this->addSql('ALTER TABLE order_item ADD CONSTRAINT FK_52EA1F098D9F6D38 FOREIGN KEY (order_id) REFERENCES "order" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE order_item ADD CONSTRAINT FK_52EA1F094584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE product DROP CONSTRAINT FK_D34A04AD12469DE2');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C64584665A');
        $this->addSql('ALTER TABLE address DROP CONSTRAINT FK_D4E6F81A76ED395');
        $this->addSql('ALTER TABLE "order" DROP CONSTRAINT FK_F5299398A76ED395');
        $this->addSql('ALTER TABLE order_item DROP CONSTRAINT FK_52EA1F098D9F6D38');
        $this->addSql('ALTER TABLE order_item DROP CONSTRAINT FK_52EA1F094584665A');

        $this->addSql('DROP TABLE order_item');
        $this->addSql('DROP TABLE "order"');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE blog_post');
        $this->addSql('DROP TABLE review');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE category');
    }
}
