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
                    restart2();
                }
            }
        }
    }
};