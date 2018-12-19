var level2 = {

    preload: function() {

        //  We need this because the assets are on github pages
        //  Remove the next 2 lines if running locally
        //game.load.baseURL = 'https://ioniodi.github.io/Shooter/';
        //game.load.crossOrigin = 'anonymous';

        //basic
        game.load.image('starfield', 'assets/starfield.png');
        game.load.image('ship', 'assets/ship.png');
        game.load.image('bullet', 'assets/bullets/bullet.png');
        game.load.image('honeyRing', 'assets/bullets/HoneyRings.png');

        //music
        game.load.audio('music', 'sounds/OrbitalColossus.mp3');
        game.load.audio('bossMusic', 'sounds/n-Dimensions.mp3');

        //sounds
        game.load.audio('rumble', 'sounds/rumble.mp3');
        game.load.audio('laser', 'sounds/laser.mp3');
        game.load.audio('enemyLaser', 'sounds/laser7.mp3');

        //enemies
        game.load.image('enemy1', 'assets/enemies/smalldrone1.png');
        game.load.image('enemy2', 'assets/enemies/spaceshippod1smallyellow.png');
        game.load.image('enemy2Bullet', 'assets/bullets/death-ray.png');
        game.load.image('aliens', 'assets/enemies/alien.png');
        game.load.image('asteroids', 'assets/enemies/asteroid.png');
        game.load.spritesheet('trail', 'assets/explode.png', 128, 128);

        // Boss2
        game.load.image('redBoss', 'assets/enemies/redBoss.png');
        game.load.image('deathRay', 'assets/bullets/death-ray.png');

        //font
        game.load.bitmapFont('spacefont', 'assets/spacefont/spacefont2.png', 'assets/spacefont/spacefont2.xml');
    },

    create: function() {

        game.scale.pageAlignHorizontally = true;

        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // New bullets
        honeyRings = game.add.group();
        honeyRings.enableBody = true;
        honeyRings.physicsBodyType = Phaser.Physics.ARCADE;
        honeyRings.createMultiple(30, 'honeyRing');
        honeyRings.setAll('anchor.x', 0.5);
        honeyRings.setAll('anchor.y', 1);
        honeyRings.setAll('outOfBoundsKill', true);
        honeyRings.setAll('checkWorldBounds', true);


        //  The hero!
        player = game.add.sprite(100, game.height / 2, 'ship');
        player.health = 100;
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
        player.body.drag.setTo(DRAG, DRAG);
        player.weaponLevel = 1;
        player.events.onKilled.add(function(){
            shipTrail.kill();
        });
        player.events.onRevived.add(function(){
            shipTrail.start(false, 5000, 10);
        });

        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Add an emitter for the ship's trail
        shipTrail = game.add.emitter(player.x - 20, player.y, 400);
        shipTrail.height = 10;
        shipTrail.makeParticles('bullet');
        shipTrail.setYSpeed(20, -20);
        shipTrail.setXSpeed(-140, -120);
        shipTrail.setRotation(50, -50);
        shipTrail.setAlpha(1, 0.01, 800);
        shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000,
                Phaser.Easing.Quintic.Out);
        shipTrail.start(false, 5000, 10);


        // Add Enemies

        // First enemy
        enemy1Level2 = game.add.group();
        enemy1Level2.enableBody = true;
        enemy1Level2.physicsBodyType = Phaser.Physics.ARCADE;
        enemy1Level2.createMultiple(50, 'enemy1');
        enemy1Level2.setAll('anchor.x', 0.5);
        enemy1Level2.setAll('anchor.y', 0.5);
        enemy1Level2.setAll('scale.x', 0.5);
        enemy1Level2.setAll('scale.y', 0.5);
        enemy1Level2.setAll('angle', 180);
        enemy1Level2.forEach(function(enemy){
            addEnemyEmitterTrail(enemy);
            enemy.body.setSize(enemy.width, enemy.height);
            enemy.damageAmount = 20;
            enemy.events.onKilled.add(function(){
                enemy.trail.kill();
            });
        });
        game.time.events.add(1000, launchEnemy1Level2);

        // Second enemy
        enemy2Level2 = game.add.group();
        enemy2Level2.enableBody = true;
        enemy2Level2.physicsBodyType = Phaser.Physics.ARCADE;
        enemy2Level2.createMultiple(30, 'enemy2');
        enemy2Level2.setAll('anchor.x', 0.5);
        enemy2Level2.setAll('anchor.y', 0.5);
        enemy2Level2.setAll('scale.x', 0.5);
        enemy2Level2.setAll('scale.y', 0.5);
        enemy2Level2.setAll('angle', 180);
        enemy2Level2.forEach(function(enemy){
            enemy.body.setSize(enemy.width, enemy.height);
            enemy.damageAmount = 30;
        });

        // Enemy3 Bullets
        enemy2Bullets = game.add.group();
        enemy2Bullets.enableBody = true;
        enemy2Bullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemy2Bullets.createMultiple(30, 'enemy2Bullet');
        enemy2Bullets.callAll('crop', null, {x: 9, y: 0, width: 20, height: 30});
        enemy2Bullets.setAll('anchor.x', 0.5);
        enemy2Bullets.setAll('anchor.y', 0.5);
        enemy2Bullets.setAll('outOfBoundsKill', true);
        enemy2Bullets.setAll('checkWorldBounds', true);
        enemy2Bullets.forEach(function(enemy){
            enemy.body.setSize(15, 20);
        });

        // Asteroids
        asteroids = game.add.group();
        asteroids.enableBody = true;
        asteroids.physicsBodyType = Phaser.Physics.ARCADE;
        asteroids.createMultiple(30, 'asteroids');
        asteroids.setAll('anchor.x', 0.5);
        asteroids.setAll('anchor.y', 0.5);
        asteroids.setAll('scale.x', 0.5);
        asteroids.setAll('scale.y', 0.5);
        asteroids.forEach(function(rock){
            rock.body.setSize(rock.width, rock.width);
            rock.damageAmount = 20;
        });

        // An explosion pool
        explosions = game.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(30, 'trail');
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        explosions.forEach(function(explosion){
            explosion.animations.add('trail');
        });

        // Alien for upgrades
        aliensForUpgrade = game.add.group();
        aliensForUpgrade.enableBody = true;
        aliensForUpgrade.physicsBodyType = Phaser.Physics.ARCADE;
        aliensForUpgrade.createMultiple(10, 'aliens');
        aliensForUpgrade.setAll('anchor.x', 0.5);
        aliensForUpgrade.setAll('anchor.y', 0.5);
        aliensForUpgrade.setAll('scale.x', 0.5);
        aliensForUpgrade.setAll('scale.y', 0.5);


        //  The boss2
        boss2 = game.add.sprite(0, 0, 'redBoss');
        boss2.exists = false;
        boss2.alive = false;
        boss2.anchor.setTo(0.5, 0.5);
        boss2.hp = 2000;
        boss2.damageAmount = 60;
        boss2.angle = 180;
        boss2.scale.x = 0.3;
        boss2.scale.y = 0.3;
        game.physics.enable(boss2, Phaser.Physics.ARCADE);
        boss2.body.maxVelocity.setTo(100, 80);
        boss2.dying = false;
        boss2.finishOff = function() {
            if (!boss2.dying) {
                boss2.dying = true;
                bossDeath.x = boss2.x;
                bossDeath.y = boss2.y;
                bossDeath.start(false, 1000, 50, 20);
                //  kill boss2 after explosions
                game.time.events.add(1000, function(){
                    var explosion = explosions.getFirstExists(false);
                    var beforeScaleX = explosions.scale.x;
                    var beforeScaleY = explosions.scale.y;
                    var beforeAlpha = explosions.alpha;
                    explosion.reset(boss2.body.x + boss2.body.halfWidth, boss2.body.y + boss2.body.halfHeight);
                    explosion.alpha = 0.4;
                    explosion.scale.x = 3;
                    explosion.scale.y = 3;
                    var animation = explosion.play('trail', 30, false, true);
                    animation.onComplete.addOnce(function(){
                        explosion.scale.x = beforeScaleX;
                        explosion.scale.y = beforeScaleY;
                        explosion.alpha = beforeAlpha;
                    });
                    boss2.kill();
                    //booster.kill();
                    boss2.dying = false;
                    bossDeath.on = false;
                });
            }
        };

        // Enemy3 Bullets
        bossBullets = game.add.group();
        bossBullets.enableBody = true;
        bossBullets.physicsBodyType = Phaser.Physics.ARCADE;
        bossBullets.createMultiple(30, 'enemy2Bullet');
        bossBullets.callAll('crop', null, {x: 9, y: 0, width: 20, height: 30});
        bossBullets.setAll('anchor.x', 0.5);
        bossBullets.setAll('anchor.y', 0.5);
        bossBullets.setAll('outOfBoundsKill', true);
        bossBullets.setAll('checkWorldBounds', true);
        bossBullets.forEach(function(enemy){
            enemy.body.setSize(15, 20);
        });

        boss2.fire = function() {
            if (game.time.now > bossBulletTimer) {
                
                // Set up Firing
                var bulletSpeed = 600;
                var firingDelay = 700;
                boss2.bullets = 5;
                boss2.lastShot = 0;
                
                // Fire
                bossBullet = bossBullets.getFirstExists(false);
                if (bossBullet &&
                    this.alive &&
                    this.bullets &&
                    game.time.now > firingDelay + this.lastShot) {
                        this.lastShot = game.time.now;
                        this.bullets--;
                        bossBullet.reset(this.x + this.width / 2, this.y);
                        bossBullet.damageAmount = this.damageAmount;
                        var angle = game.physics.arcade.moveToObject(bossBullet, player, bulletSpeed);
                        bossBullet.angle = game.math.radToDeg(angle);
			    }
            }
        };

        boss2.update = function() {
            if (!boss2.alive) return;

            if (boss2.y > player.y) {
                boss2.body.acceleration.y = -50;
            }
            if (boss2.y < player.y) {
                boss2.body.acceleration.y = 50;
            }
            if (boss2.x < game.width - 100) {
                boss2.body.acceleration.x = 50;
            }
            if (boss2.x > game.width - 100) {
                boss2.body.acceleration.x = -50;
            }

            //  Squish and rotate boss2 for illusion of "banking"
            var bank = boss2.body.velocity.y / MAXSPEED;
            boss2.scale.y = 0.6 - Math.abs(bank) / 3;
            boss2.angle = bank;

            //  fire if player is in target
            var angleToPlayer = game.math.radToDeg(game.physics.arcade.angleBetween(boss2, player));
            var anglePointing = Math.abs(boss2.angle);
            if (anglePointing - angleToPlayer < 20) {
                boss2.fire();
            }
        }
        boss2.bringToTop();

         //  Big explosion for boss2
        bossDeath = game.add.emitter(boss2.x, boss2.y);
        bossDeath.width = boss2.width / 2;
        bossDeath.height = boss2.height / 2;
        bossDeath.makeParticles('trail', [0,1,2,3,4,5,6,7], 20);
        bossDeath.setAlpha(0.9, 0, 900);
        bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);


        // Shield Stat
        shields = game.add.bitmapText(game.world.width - 800, 10, 'spacefont', 'Shields: ' + player.health +'%', 50);
        shields.render = function(){
            shields.text = 'Shields: ' + Math.max(player.health, 0) + '%';
        }
        shields.render();

        // Score Text
        scoreText = game.add.bitmapText(game.world.width - 800, 550, 'spacefont', '', 50);
        scoreText.render = function () {
            scoreText.text = 'Score: ' + score;
        };
        scoreText.render();

        // Game Over Text
        gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
        gameOver.x = gameOver.x - gameOver.textWidth / 2;
        gameOver.y = gameOver.y - gameOver.textHeight / 3;
        gameOver.visible = false;

        // Add Music
        music = game.add.audio('music');
        music.volume = 0.5;
        music.loop = true;
        music.play();

        // Add bossMusic
        bossMusic = game.add.audio('bossMusic');
        bossMusic.volume = 0.5;
        bossMusic.loop = true;

        //	Add Sounds
        laser = game.add.audio('laser');
        laser.volume = 0.1;

        rumble = game.add.audio('rumble');
        rumble.volume = 1;

        enemyLaser = game.add.audio('enemyLaser');
        enemyLaser.volume = 0.5;
    },

    update: function() {

        //  Scroll the background
        starfield.tilePosition.x -= 2;

        //  Reset the player, then check for movement keys
        player.body.acceleration.y = 0;
        player.body.acceleration.x = 0;

        if (cursors.up.isDown) {
            player.body.acceleration.y = -ACCLERATION;
        } else if (cursors.down.isDown) {
            player.body.acceleration.y = ACCLERATION;
        } else if (cursors.left.isDown) {
            player.body.acceleration.x = -ACCLERATION;
        } else if (cursors.right.isDown) {
            player.body.acceleration.x = ACCLERATION;
        }

        //  Stop at screen edges
        if (player.x > game.width - 30) {
            player.x = game.width - 30;
            player.body.acceleration.x = 0;
        }
        if (player.x < 30) {
            player.x = 30;
            player.body.acceleration.x = 0;
        }
        if (player.y > game.height - 15) {
            player.y = game.height - 15;
            player.body.acceleration.y = 0;
        }
        if (player.y < 15) {
            player.y = 15;
            player.body.acceleration.y = 0;
        }

        //  Fire bullet
        if (player.alive && fireButton.isDown) {
            fireBullet();
        }

        //  Keep the shipTrail lined up with the ship
        shipTrail.y = player.y;
        shipTrail.x = player.x - 20;

        // Check collisions

        // Enemy1Level2
        game.physics.arcade.overlap(player, enemy1Level2, shipCollide, null, this);
        game.physics.arcade.overlap(enemy1Level2, bullets, hitEnemyLevel2, null, this);
        game.physics.arcade.overlap(enemy1Level2, honeyRings, hitEnemyLevel2, null, this);

        // Enemy2Level2
        game.physics.arcade.overlap(player, enemy2Level2, shipCollide, null, this);
        game.physics.arcade.overlap(enemy2Level2, bullets, hitEnemyLevel2, null, this);
        game.physics.arcade.overlap(enemy2Level2, honeyRings, hitEnemyLevel2, null, this);
        game.physics.arcade.overlap(player, enemy2Bullets, enemyHitsPlayer, null, this);

        // Asteroids
        game.physics.arcade.overlap(player, asteroids, shipCollide, null, this);
        game.physics.arcade.overlap(asteroids, bullets, hitEnemyLevel2, null, this);
        game.physics.arcade.overlap(asteroids, honeyRings, hitEnemyLevel2, null, this);

        // Aliens to use to upgrade the weapons
        game.physics.arcade.overlap(aliensForUpgrade, bullets, hitAlien, null, this);
        game.physics.arcade.overlap(aliensForUpgrade, honeyRings, hitAlien, null, this);

        // boss2
        game.physics.arcade.overlap(boss2, bullets, hitBoss, bossHitTest, this);
        game.physics.arcade.overlap(boss2, honeyRings, hitBoss, bossHitTest, this);
        game.physics.arcade.overlap(player, bossBullets, enemyHitsPlayer, null, this);

        // Game Over fading and restarting game
        if (!player.alive && gameOver.visible === false) {
            gameOver.visible = true;
            gameOver.alpha = 0;
            var fadeInGameOver = game.add.tween(gameOver);
            fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(setResetHandlers);
            fadeInGameOver.start();
            function setResetHandlers(){
                // Add "Click to restart"
                tapRestart = game.input.onTap.addOnce(_restart,this);
                spaceRestart = fireButton.onDown.addOnce(_restart,this);
                function _restart() {
                      tapRestart.detach();
                      spaceRestart.detach();
                    restart();
                }
            }
        }
    }
};