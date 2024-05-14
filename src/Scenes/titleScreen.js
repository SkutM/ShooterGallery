class titleScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'titleScreen' });
    }

    preload() {
       
    }

    create() {
        this.createTitle();
    }

    createTitle() {
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000).setOrigin(0, 0);
        this.titleText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'Space Brawl', { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5);

        // start button
        this.startButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Start Game', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5).setInteractive();

        this.startButton.on('pointerdown', () => this.startGame());
        this.startButton.on('pointerover', () => this.startButton.setStyle({ fill: '#f8ff38'}));
        this.startButton.on('pointerout', () => this.startButton.setStyle({ fill: '#ffffff'}));
    }

    startGame() {
        this.scene.start('dMovement'); 
    }
}