class scene2 extends Phaser.Scene {
    constructor() {
        super("scene2");
        this.my = { sprite: { enemies: [] } };
        this.bodyX = 300;
        this.bodyY = 500;
        this.enemyY = 100;
        this.speed = 300;
        this.emitSpeed = -500;
        this.enemySpeed = 100;
        this.enemyDirection = 1;
        this.enemyShootSpeed = 400;
        this.lastFired = 0;
        this.fireRate = 1000;
        this.playerLives = 3;
        this.remainingEnemies = 4;
        this.enemySpeeds = [150, -150, 100, -100];
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlasXML("platformer", "spritesheet_default.png", "spritesheet_default.xml");
        document.getElementById('description').innerHTML = '<h2>Level 2 - Hell in Space!</h2>';
    }

    create() {
        let my = this.my;

        my.sprite.player = this.physics.add.sprite(this.bodyX, this.bodyY, "platformer", "character_roundGreen.png").setOrigin(0.5, 0.5);

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.emittedObjects = this.physics.add.group({ maxSize: 1000 });

        for (let i = 0; i < 4; i++) {
            let xPosition = 150 + i * 150;
            let enemy = this.physics.add.sprite(xPosition, 100, "platformer", "character_roundRed.png").setOrigin(0.5, 0.5);
            enemy.speed = this.enemySpeeds[i];
            this.my.sprite.enemies.push(enemy);
        }

        this.enemyEmittedObjects = this.physics.add.group();

        this.enemyShootTimer = this.time.addEvent({
            delay: 2000,
            callback: this.enemyShoot,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.emittedObjects, my.sprite.enemies, this.destroyEnemy, null, this);
        this.physics.add.overlap(this.enemyEmittedObjects, my.sprite.player, this.hitPlayer, null, this);

        this.livesText = this.add.text(10, this.sys.game.config.height - 30, 'Lives: ' + this.playerLives, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.livesText.setScrollFactor(0);
    }

    enemyShoot() {
        this.my.sprite.enemies.forEach(enemy => {
            if (enemy.active) {
                let projectile = this.enemyEmittedObjects.create(enemy.x, enemy.y, "platformer", "item_arrow.png");
                if (projectile) {
                    projectile.setVelocityY(this.enemyShootSpeed);
                    projectile.angle = 90;
                }
            }
        });
    }

    destroyEnemy(projectile, enemy) {
        projectile.destroy();
        enemy.destroy();
        enemy.active = false;
        this.remainingEnemies -= 1;

        if (this.remainingEnemies === 0) {
            this.endGameAndTransition();
        }
    }

    endGameAndTransition() {
        this.scene.stop("scene2");
        this.playerLives = 3;
        this.remainingEnemies = 4;
        this.scene.start('scene3');
    }

    hitPlayer(player, projectile) {
        projectile.destroy();
        this.playerLives -= 1;
        this.livesText.setText('Lives: ' + this.playerLives);

        if (this.playerLives > 0) {
            player.setAlpha(0.5);
            player.disableBody(true, false);
            this.time.delayedCall(3000, () => {
                this.respawnPlayer(player);
            });
        } else {
            this.gameOver();
        }
    }

    respawnPlayer(player) {
        player.enableBody(true, this.bodyX, this.bodyY, true, true);
        player.setAlpha(1);
    }

    gameOver() {
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Game Over', {
            fontSize: '40px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => {
            this.scene.stop("scene2");
            this.playerLives = 3;
            this.remainingEnemies = 4;
            this.scene.start("titleScreen");
        });
    }

    update(time, delta) {
        let my = this.my;

        if (this.keyA.isDown && my.sprite.player && my.sprite.player.active) {
            my.sprite.player.x -= this.speed * delta / 1000;
        } else if (this.keyD.isDown && my.sprite.player && my.sprite.player.active) {
            my.sprite.player.x += this.speed * delta / 1000;
        }

        if (my.sprite.player) {
            my.sprite.player.x = Phaser.Math.Clamp(my.sprite.player.x, 0, this.sys.game.config.width);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keySpace) && my.sprite.player && my.sprite.player.active && (time > this.lastFired + this.fireRate)) {
            let emitted = this.emittedObjects.create(my.sprite.player.x, my.sprite.player.y, "platformer", "item_arrow.png");
            if (emitted) {
                emitted.setVelocityY(this.emitSpeed);
                emitted.angle = -90;
            }
            this.lastFired = time;
        }

        this.my.sprite.enemies.forEach(enemy => {
            if (Math.random() < 0.02) {
                enemy.speed = Phaser.Math.Between(-150, 150);
            }

            const potentialX = enemy.x + enemy.speed * delta / 1000;
            const potentialY = enemy.y + Math.sin(time / 1000) * enemy.speed * delta / 1000;

            if (potentialX < 50 || potentialX > this.sys.game.config.width - 50) {
                enemy.speed *= -1;
            }

            enemy.x = Phaser.Math.Clamp(potentialX, 50, this.sys.game.config.width - 50);
            enemy.y = Phaser.Math.Clamp(potentialY, 50, 200);

            if (enemy === this.my.sprite.enemies[3]) {
            }
        });

        this.emittedObjects.children.iterate(projectile => {
            if (projectile.y < 0) {
                projectile.destroy();
            }
        });

        this.enemyEmittedObjects.children.iterate(projectile => {
            if (projectile.y > this.sys.game.config.height) {
                projectile.destroy();
            }
        });

        this.emittedObjects.children.iterate(projectile => {
            if (projectile.y < 0) {
                projectile.destroy();
            }
        });

        this.enemyEmittedObjects.children.iterate(projectile => {
            if (projectile.y > this.sys.game.config.height) {
                projectile.destroy();
            }
        });
    }
}