// @ts-nocheck
import Phaser from 'phaser';
export default class CollectingStarsScene extends Phaser.Scene {
  constructor() {
    super('collecting-stars-scene');
  }

  init() {
    this.platforms = undefined;
    this.player = undefined;
    this.enemies1 = undefined;
    this.enemies2 = undefined;
    this.enemies3 = undefined;
    this.enemies4 = undefined;
    this.attack = undefined;
    this.cursor = undefined;
    this.scoreText = undefined;
    this.score = 0;
    this.slash = undefined;
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

    this.load.spritesheet('knight-attack', 'images/Knight-Attack-Sheet.png', {
      frameWidth: 518 / 7,
      frameHeight: 74,
    });

    this.load.spritesheet('enemies', 'images/Enemy-Sprites.png', {
      frameWidth: 256 / 4,
      frameHeight: 192 / 4,
    });

    this.load.spritesheet('slash', 'images/slash.png', {
      frameWidth: 42,
      frameHeight: 88,
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

    // Enemies
    this.enemies1 = this.physics.add
      .sprite(750, 450, 'enemies', 0)
      .setSize(0.5, 64)
      .setScale(2);
    this.enemies1.setCollideWorldBounds(true); // restraint the sprite to not go far away from the main stage
    this.physics.add.collider(this.enemies1, this.platforms); // make the player to hit the ground

    this.enemies2 = this.physics.add
      .sprite(100, 100, 'enemies', 0)
      .setSize(0.5, 64)
      .setScale(2)
      .setFlipX(true);
    this.enemies2.setCollideWorldBounds(true); // restraint the sprite to not go far away from the main stage
    this.physics.add.collider(this.enemies2, this.platforms); // make the player to hit the ground

    this.enemies3 = this.physics.add
      .sprite(750, 100, 'enemies', 0)
      .setSize(0.5, 64)
      .setScale(2);
    this.enemies3.setCollideWorldBounds(true); // restraint the sprite to not go far away from the main stage
    this.physics.add.collider(this.enemies3, this.platforms); // make the player to hit the ground

    this.enemies4 = this.physics.add
      .sprite(750, 250, 'enemies', 0)
      .setSize(0.5, 64)
      .setScale(2);
    this.enemies4.setCollideWorldBounds(true); // restraint the sprite to not go far away from the main stage
    this.physics.add.collider(this.enemies4, this.platforms); // make the player to hit the ground

    // Inputs
    this.cursor = this.input.keyboard.createCursorKeys();

    // Create animations
    this.createAnimation();

    // Scoring text
    // x offset, y offset, text to show
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      // @ts-ignore
      fontSize: '32px',
      fill: 'yellow',
    });

    // Slash effect
    this.slash = this.physics.add
      .sprite(0, 0, 'slash')
      .setActive(false)
      .setVisible(false)
      // .setGravityY(-500)
      .setOffset(0, -10)
      .setDepth(1)
      .setCollideWorldBounds(true);

    // When enemy's slash hits player
    this.physics.add.overlap(
      this.slash,
      this.player,
      this.spriteHit,
      null,
      this
    );

    // When player's slash hits enemy
    this.physics.add.overlap(
      this.slash,
      this.enemies1,
      this.spriteHit,
      null,
      this
    );
    this.physics.add.overlap(
      this.slash,
      this.enemies2,
      this.spriteHit,
      null,
      this
    );
    this.physics.add.overlap(
      this.slash,
      this.enemies3,
      this.spriteHit,
      null,
      this
    );
    this.physics.add.overlap(
      this.slash,
      this.enemies4,
      this.spriteHit,
      null,
      this
    );

    // Enemy attack
    this.time.addEvent({
      delay: 5000,
      callback: this.enemy1Attack,
      callbackScope: this,
      loop: true,
    });
    this.time.addEvent({
      delay: 8000,
      callback: this.enemy4Attack,
      callbackScope: this,
      loop: true,
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
    } else if (this.cursor.space.isDown) {
      this.player.anims.play('attack', true);

      // Kalo kebalik arah, buat slashnya ngikut juga
      if (this.player.flipX) {
        this.time.delayedCall(200, () => {
          this.createSlash(this.player.x + 60, this.player.y, 4, 600);
        });
      } else {
        this.time.delayedCall(200, () => {
          this.createSlash(this.player.x - 60, this.player.y, 4, -600, true);
        });
      }
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('idle', true);
    }
    if (this.cursor.up.isDown) {
      this.player.setVelocity(0, -200);
    }

    this.scoreText.setText('Score:' + this.score);

    // Win logic
    if (this.score >= 40) {
      this.physics.pause();
      this.add.text(300, 300, 'Congrats! You win!!', {
        fontSize: '48px',
        fill: 'yellow',
      });
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

  createAnimation() {
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

    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers('knight-attack', {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  spriteHit(slash, sprite) {
    slash.x = 0;
    slash.y = 0;
    slash.setActive(false);
    slash.setVisible(false);

    if (
      sprite.texture.key === 'knight' ||
      sprite.texture.key === 'knight-attack'
    ) {
      // sprite.anims.play('player-hit', true);
      this.gameOver();
    } else {
      // sprite.anims.play('enemy-hit', true);
      sprite.setVisible(false).setScale(0);
      this.score += 10;
    }
  }
  createSlash(x, y, frame, velocity, flip = false) {
    this.slash
      .setPosition(x, y)
      .setActive(true)
      .setVisible(true)
      .setFrame(frame)
      .setFlipX(flip)
      .setVelocityX(velocity)
      .setVelocityY(0);
  }
  enemy1Attack() {
    this.createSlash(this.enemies1.x - 60, this.enemies1.y, 2, -600, true);
  }

  enemy2Attack() {
    this.createSlash(this.enemies2.x + 60, this.enemies2.y, 2, 600);
  }

  enemy3Attack() {
    this.createSlash(this.enemies3.x - 60, this.enemies3.y, 2, -600, true);
  }

  enemy4Attack() {
    this.createSlash(this.enemies4.x - 60, this.enemies4.y, 2, -600, true);
  }
  gameOver(player, bomb) {
    this.physics.pause();
    this.add.text(300, 300, 'Game Over! \n The ghost hit you!', {
      fontSize: '36px',
      fontStyle: 'bold',
      fill: 'red',
    });
  }
}
