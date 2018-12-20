var congrats = {
    preload: () => {
        game.load.bitmapFont('spacefont', 'assets/spacefont/spacefont2.png', 'assets/spacefont/spacefont2.xml');
    },

    create: () => {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        congrats = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'Congratulations! You have Completed the Game!\n   If you\'d like to replay just press the fire button\n                    or tap with your mouse!', 30);
        congrats.x = congrats.x - congrats.textWidth / 2;
        congrats.y = congrats.y - congrats.textWidth / 8;
        congrats.visible = true;
    },

    update: () => {
        tapRestart = game.input.onTap.addOnce(_restart, this);
        spaceRestart = fireButton.onDown.addOnce(_restart, this);
        function _restart() {
            tapRestart.detach();
            spaceRestart.detach();
            game.state.start('Menu', true, true);
        }
    }
}