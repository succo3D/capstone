import {network} from "./network"
import * as shared from "@shared/defines"



export default class SceneGameplay extends Phaser.Scene {

    player: shared.Player = new shared.Player(400, 300);
    sprite!: Phaser.GameObjects.Sprite;

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('player', 'assets/player.png');
    }

    create() {
        network.connect();
        const socket = network.getSocket();
        this.add.image(400, 300, 'bg');
        this.sprite = this.add.sprite(this.player.x, this.player.y, 'player');
    }

    update() {

        var cursorKeys = this.input.keyboard?.createCursorKeys();

        let playerInput = new shared.PlayerInput;

        if (cursorKeys) {
            playerInput.moveUp = cursorKeys.up.isDown;
            playerInput.moveDown = cursorKeys.down.isDown;
            playerInput.moveLeft = cursorKeys.left.isDown;
            playerInput.moveRight = cursorKeys.right.isDown;
        }

        shared.updatePlayer(this.player, playerInput);
        this.sprite.setPosition(this.player.x, this.player.y);
    }
}