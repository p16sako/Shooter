var level1 = {
    
    preload: function() {
        
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
        game.load.audio('bossLaser', 'sounds/Rifle.mp3');

        //enemies
        game.load.image('enemy2', 'assets/enemies/enemy2.png');
        game.load.image('enemy3', 'assets/enemies/enemy3.png');
        game.load.image('enemy3Bullet', 'assets/bullets/blue-enemy-bullet.png');
        game.load.image('aliens', 'assets/enemies/alien.png');
        game.load.spritesheet('trail', 'assets/explode.png', 128, 128);

        //Boss1
        game.load.image('blueBoss', 'assets/enemies/blueBoss.png');
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
        enemy2 = game.add.group();
        enemy2.enableBody = true;
        enemy2.physicsBodyType = Phaser.Physics.ARCADE;
        enemy2.createMultiple(30, 'enemy2');
        enemy2.setAll('anchor.x', 0.5);
        enemy2.setAll('anchor.y', 0.5);
        enemy2.setAll('scale.x', 0.5);
        enemy2.setAll('scale.y', 0.5);
        enemy2.setAll('angle', 180);
        enemy2.forEach(function(enemy){
            addEnemyEmitterTrail(enemy);
            ///enemy.body.setSize(enemy.width * 3, enemy.height * 3);
            enemy.damageAmount = 20;
            enemy.events.onKilled.add(function(){
                enemy.trail.kill();
            });
        });
        game.time.events.add(1000, launchEnemy2);

        // Second enemy
        enemy3 = game.add.group();
        enemy3.enableBody = true;
        enemy3.physicsBodyType = Phaser.Physics.ARCADE;
        enemy3.createMultiple(30, 'enemy3');
        enemy3.setAll('anchor.x', 0.5);
        enemy3.setAll('anchor.y', 0.5);
        enemy3.setAll('scale.x', 0.5);
        enemy3.setAll('scale.y', 0.5);
        enemy3.setAll('angle', 180);
        enemy3.forEach(function(enemy){
            //enemy.body.setSize(enemy.width * 4, enemy.height * 4);
            enemy.damageAmount = 40;
        });

        // Enemy3 Bullets
        enemy3Bullets = game.add.group();
        enemy3Bullets.enableBody = true;
        enemy3Bullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemy3Bullets.createMultiple(30, 'enemy3Bullet');
        enemy3Bullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 45});
        enemy3Bullets.setAll('alpha', 0.9);
        enemy3Bullets.setAll('anchor.x', 0.5);
        enemy3Bullets.setAll('anchor.y', 0.5);
        enemy3Bullets.setAll('outOfBoundsKill', true);
        enemy3Bullets.setAll('checkWorldBounds', true);
        enemy3Bullets.forEach(function(enemy){
            enemy.body.setSize(20, 20);
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


        //  The boss1
        boss1 = game.add.sprite(0, 0, 'blueBoss');
        boss1.exists = false;
        boss1.alive = false;
        boss1.anchor.setTo(0.5, 0.5);
        boss1.hp = 1000;
        boss1.damageAmount = 50;
        boss1.angle = 180;
        boss1.scale.x = 1.2;
        boss1.scale.y = 1.2;
        game.physics.enable(boss1, Phaser.Physics.ARCADE);
        boss1.body.maxVelocity.setTo(100, 80);
        boss1.dying = false;
        boss1.finishOff = function() {
            if (!boss1.dying) {
                boss1.dying = true;
                bossDeath.x = boss1.x;
                bossDeath.y = boss1.y;
                bossDeath.start(false, 1000, 50, 20);
                //  kill boss1 after explosions
                game.time.events.add(1000, function(){
                    var explosion = explosions.getFirstExists(false);
                    var beforeScaleX = explosions.scale.x;
                    var beforeScaleY = explosions.scale.y;
                    var beforeAlpha = explosions.alpha;
                    explosion.reset(boss1.body.x + boss1.body.halfWidth, boss1.body.y + boss1.body.halfHeight);
                    explosion.alpha = 0.4;
                    explosion.scale.x = 3;
                    explosion.scale.y = 3;
                    var animation = explosion.play('trail', 30, false, true);
                    animation.onComplete.addOnce(function(){
                        explosion.scale.x = beforeScaleX;
                        explosion.scale.y = beforeScaleY;
                        explosion.alpha = beforeAlpha;
                    });
                    boss1.kill();
                    //booster.kill();
                    boss1.dying = false;
                    bossDeath.on = false;
                });
            }
        };

        //  boss1 death ray
        function addRay(leftRight) {
            var ray = game.add.sprite(0 , leftRight * boss1.height * 0.25 , 'deathRay');
            ray.alive = false;
            ray.visible = false;
            boss1.addChild(ray);
            ray.crop({x: 0, y: 0, width: 40, height: 40});
            ray.anchor.x = 0.5;
            ray.anchor.y = 0.5;
            ray.scale.y = 2;
            ray.damageAmount = boss1.damageAmount;
            game.physics.enable(ray, Phaser.Physics.ARCADE);
            ray.body.setSize(ray.width * 8, ray.height / 4);
            ray.update = function() {
                this.alpha = game.rnd.realInRange(0.6, 1);
            };
            boss1['ray' + (leftRight > 0 ? 'Right' : 'Left')] = ray;
        }

        //  need to add the ship texture to the group so it renders over the rays
        var ship = game.add.sprite(0, 0, 'blueBoss');
        ship.anchor = {x: 0.5, y: 0.5};
        boss1.addChild(ship);

        boss1.fire = function() {
                var raySpacing = 5000;
                var chargeTime = 1500;
                var rayTime = 2000;

                function chargeAndShoot(side) {
                    ray = boss1['ray' + side];
                    ray.name = side
                    ray.revive();
                    ray.x = -80;
                    ray.alpha = 0;
                    ray.scale.x = 20;
                    game.add.tween(ray).to({alpha: 15}, chargeTime, Phaser.Easing.Linear.In, true).onComplete.add(function(ray){
                        ray.scale.x = 400;
                        game.add.tween(ray).to({x: -1500}, rayTime, Phaser.Easing.Linear.In, true).onComplete.add(function(ray){
                            ray.kill();
                        });
                    });
                }
                chargeAndShoot('Right');
                chargeAndShoot('Left');
                bossLaser.play();

                bossBulletTimer = game.time.now + raySpacing;
        };

        boss1.update = function() {
            if (!boss1.alive) return;
            
            if (!boss1.rayLeft && !boss1.rayRight ){
                addRay(1);
                addRay(-1);
            }

            boss1.rayLeft.update();
            boss1.rayRight.update();

            //console.log('after update ->',boss1.rayLeft);
            //console.log('after update ->',boss1.rayRight);
            
            if (boss1.y > player.y) {
                boss1.body.acceleration.y = -50;
            }
            if (boss1.y < player.y) {
                boss1.body.acceleration.y = 50;
            }
            if (boss1.x < game.width - 100) {
                boss1.body.acceleration.x = 50;
            }
            if (boss1.x > game.width - 100) {
                boss1.body.acceleration.x = -50;
            }

            //  Squish and rotate boss1 for illusion of "banking"
            var bank = boss1.body.velocity.y / MAXSPEED;
            boss1.scale.y = 0.6 - Math.abs(bank) / 3;
            boss1.angle = bank;

            //  fire if player is in target
            var angleToPlayer = game.math.radToDeg(game.physics.arcade.angleBetween(player, boss1));
            var anglePointing = Math.abs(boss1.angle);
            if (game.time.now > bossBulletTimer && anglePointing - angleToPlayer < 18) {
                boss1.fire();
            }
        }
        boss1.bringToTop();

         //  Big explosion for boss1
        bossDeath = game.add.emitter(boss1.x, boss1.y);
        bossDeath.width = boss1.width / 2;
        bossDeath.height = boss1.height / 2;
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

        // Next Level text
        nextLevel = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', "      Congratulations!\nProceed to the next level", 50);
        nextLevel.x = nextLevel.x - nextLevel.textWidth / 2;
        nextLevel.y = nextLevel.y - nextLevel.textHeight / 3;
        nextLevel.visible = false;

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

        bossLaser = game.add.audio('bossLaser');
        bossLaser.volume = 0.7;
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


        // Enemy2
        game.physics.arcade.overlap(player, enemy2, shipCollide, null, this);
        game.physics.arcade.overlap(enemy2, bullets, hitEnemy, null, this);
        game.physics.arcade.overlap(enemy2, honeyRings, hitEnemy, null, this);

        // Enemy3
        game.physics.arcade.overlap(player, enemy3, shipCollide, null, this);
        game.physics.arcade.overlap(enemy3, bullets, hitEnemy, null, this);
        game.physics.arcade.overlap(enemy3, honeyRings, hitEnemy, null, this);
        game.physics.arcade.overlap(player, enemy3Bullets, enemyHitsPlayer, null, this);

        // Aliens to use to upgrade the weapons
        game.physics.arcade.overlap(aliensForUpgrade, bullets, hitAlien, null, this);
        game.physics.arcade.overlap(aliensForUpgrade, honeyRings, hitAlien, null, this);

        // boss1
        game.physics.arcade.overlap(boss1, bullets, hitBoss, bossHitTest, this);
        game.physics.arcade.overlap(boss1, honeyRings, hitBoss, bossHitTest, this);
        game.physics.arcade.overlap(player, boss1.rayRight, enemyHitsPlayer, null, this);
        game.physics.arcade.overlap(player, boss1.rayLeft, enemyHitsPlayer, null, this);

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

        // Congratulate the player for finishing Level 1 and calling Level 2
        if (!boss1.alive && bossLaunched && nextLevel.visible === false){
            nextLevel.visible = true;
            nextLevel.alpha = 0;
            var fadeInNextLevel = game.add.tween(nextLevel);
            fadeInNextLevel.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInNextLevel.onComplete.add(proceedToNextLevel);
            fadeInNextLevel.start();
            
            // Enemies
            enemy2.callAll('kill');
            enemy3.callAll('kill');
            enemy3Bullets.callAll('kill');
            game.time.events.remove(enemy2LaunchTimer);
            game.time.events.remove(enemy3LaunchTimer);
            
            //Boss
            boss1.hp = 1000;
            bossLaunched = false;
            bossMusic.stop();
            
            function proceedToNextLevel(){
                tapProceed = game.input.onTap.addOnce(_nextLevel, this);
                spaceProceed = fireButton.onDown.addOnce(_nextLevel, this);
                function _nextLevel(){
                    tapProceed.detach();
                    spaceProceed.detach();
                    next();
                }
            }
        }
    }
};
