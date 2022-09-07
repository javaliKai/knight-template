// @ts-nocheck
import Phaser from 'phaser';
export default class CollectingStarsScene extends Phaser.Scene {
  constructor() {
    super('collecting-stars-scene');
  }

  init() {
    this.platforms = undefined;
    this.player = undefined;
    this.cursor = undefined;
    this.scoreText = undefined;
    this.score = 0;
  }

  preload() {
    this.load.image('rock-ground', 'images/rock-tile.png');
    this.load.image('castle-bg', 'images/castle-bg.png');
    this.load.spritesheet('knight', 'images/knight-idle.png', {
      frameWidth: 256 / 4,
      frameHeight: 64,
    });

    this.load.spritesheet('knight-walk', 'images/knight-walk.png', {
      frameWidth: 512 / 8,
      frameHeight: 64,
    });
  }

  create() {
    // Adding background
    this.add.image(400, 300, 'castle-bg').setScale(2.5);

    // Static group
    this.platforms = this.physics.add.staticGroup();

    // Creating green platforms
    this.platforms.create(600, 400, 'rock-ground');
    this.platforms.create(50, 250, 'rock-ground');
    this.platforms.create(750, 220, 'rock-ground');
    this.platforms.create(400, 568, 'rock-ground').setScale(2).refreshBody();

    // Sprites/character
    this.player = this.physics.add
      .sprite(100, 450, 'knight')
      .setSize(0.5, 64)
      .setScale(2);
    this.player.setCollideWorldBounds(true); // restraint the sprite to not go far away from the main stage
    this.physics.add.collider(this.player, this.platforms); // make the player to hit the ground

    // Inputs
    this.cursor = this.input.keyboard.createCursorKeys();

    // Animations
    // idle
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('knight-walk', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Scoring text
    // x offset, y offset, text to show
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      // @ts-ignore
      fontSize: '32px',
      fill: 'yellow',
    });
  }

  update() {
    // Move logic
    if (this.cursor.left.isDown) {
      this.player.setVelocity(-200, 200);
      this.player.anims.play('walk', true);
      this.player.setFlipX(false);
    } else if (this.cursor.right.isDown) {
      this.player.setVelocity(200, 200);
      this.player.setFlipX(true);
      this.player.anims.play('walk', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('idle', true);
    }

    if (this.cursor.up.isDown) {
      this.player.setVelocity(0, -200);
    }

    // Win logic
    if (this.score >= 100) {
      this.physics.pause();
      this.add.text(
        300,
        300,
        'Congrats! You win!! The stars are all yours to take :D',
        {
          fontSize: '48px',
          fill: 'yellow',
        }
      );
    }
  }

  gameOver() {
    this.physics.pause();
    this.add.text(300, 300, 'Game Over! \n You stepped on a bomb!', {
      fontSize: '36px',
      fontStyle: 'bold',
      fill: 'red',
    });
  }
}
