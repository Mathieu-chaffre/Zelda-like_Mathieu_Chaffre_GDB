var config = {
  width: 800,
  height: 600,
  parent: "game-container",
  physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [Scene1, Scene2, Scene3, Scene4, Scene5]
  }

var game = new Phaser.Game(config);
