import { network } from "./network"
import { PlayerState, PlayerInput, updatePlayer } from "@shared/defines"
import { PlayerObject } from "./player";

export default class SceneGameplay extends Phaser.Scene {

    player!: PlayerObject;
    group!: Phaser.GameObjects.Group;

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('player', 'assets/player.png');
    }

    create() {
        network.connect();
        const socket = network.getSocket();

        this.add.image(400, 300, 'bg');

        this.player = new PlayerObject(this, 400, 300, 'player');

        this.group = this.add.group({runChildUpdate: false});
        this.group.add(this.player, true);
    }

    update(time: number, delta: number) {

        updatePlayer(this.player.pState, this.getPlayerInput());

        this.player.update(time, delta);
    }

    getPlayerInput() {

        var cursorKeys = this.input.keyboard?.createCursorKeys();

        let playerInput = new PlayerInput;

        if (cursorKeys) {
            playerInput.moveUp = cursorKeys.up.isDown;
            playerInput.moveDown = cursorKeys.down.isDown;
            playerInput.moveLeft = cursorKeys.left.isDown;
            playerInput.moveRight = cursorKeys.right.isDown;
        }

        return playerInput;

    }
}

