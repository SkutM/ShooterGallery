const config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Set to true to see physics bodies for debugging
        }
    },
    fps: {
        forceSetTimeOut: true,
        target: 30
    },
    scene: [titleScreen, dMovement, scene2, scene3, finale]
};

const game = new Phaser.Game(config);