var menu = {
    preload: () => {
        game.load.image('Menu', 'assets/Menu.png');
        game.load.image('Level1', 'assets/Level1.png');
        game.load.image('Level2', 'assets/Level2.png');

        game.load.audio('music', 'sounds/OrbitalColossus.mp3');
    },

    create: () => {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        music = game.add.audio('music');
        music.volume = 0.5;
        music.loop = true;
        music.play();

        // Picture for menu
        game.add.sprite(0, 0, 'Menu');

        // Picture and button to choose level 1
        var click1 = game.add.button(game.width /2 - 100, game.height / 2 + 25, 'Level1', function(){
            level = 1;
            music.stop();
            game.state.start('Level1', true, true);

        });
        click1.anchor.set(0.5,0.5);
        
        // Picture and button to choose level 2
        var click2 = game.add.button(game.width /2 + 100, game.height / 2 + 25, 'Level2', function(){
            level = 2;
            music.stop();
            game.state.start('Level2', true, true);

        });
        click2.anchor.set(0.5,0.5);
    }
}