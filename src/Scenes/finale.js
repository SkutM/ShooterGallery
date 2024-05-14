class finale extends Phaser.Scene {
    constructor() {
        super({ key: 'finale' });
    }

    create() {
        // Display the congratulatory message
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 100, 'Congratulations! You have won against the Space Lord.', {
            font: '24px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Create a button that goes back to the title screen
        const titleButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Title Screen', {
            font: '20px Arial',
            fill: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            borderRadius: 5
        })
        .setInteractive()
        .setOrigin(0.5);

        titleButton.on('pointerdown', () => {
            this.scene.start('titleScreen');  // Change to the key of your title screen scene
        });

        titleButton.on('pointerover', () => {
            titleButton.setStyle({ fill: '#f39c12' });  // Change the color on hover
        });

        titleButton.on('pointerout', () => {
            titleButton.setStyle({ fill: '#ff0000' });  // Reset the color when not hovering
        });
    }
}