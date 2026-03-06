import { network } from "./network";
import { PlayerState, PlayerInput, updatePlayer } from "@shared/defines";
import { PlayerObject } from "./player";
import type { Socket } from "socket.io-client";

let socket: Socket;

export default class SceneGameplay extends Phaser.Scene {

    player!: PlayerObject;
    players: Map<string, PlayerObject> = new Map();
    group!: Phaser.GameObjects.Group;

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('player', 'assets/player.png');
    }

    create() {
        this.group = this.add.group({runChildUpdate: false});

        network.connect();
        socket = network.getSocket();

        socket.on("snapshot", (states: Record<string, PlayerState>) => {
            for (let id of Object.keys(states)) {
                let player = this.players.get(id);
                let state = states[id];
                if(!state)
                    continue;
                if(!player) {
                    let newPlayer = new PlayerObject(this, state, 'player');
                    this.players.set(id, newPlayer);
                    this.group.add(newPlayer, true);
                }
                else {
                    player.pState = state;
                    player.update();
                }
            }
        });

        socket.on("newPlayer", (state, id) => {
            let newPlayer = new PlayerObject(this, state, 'player');
            this.players.set(id, newPlayer);
            this.group.add(newPlayer, true);
            this.player = newPlayer;
        });

        socket.on("playerDisconnected", (id) => {
            console.log("guy left");
            let player = this.players.get(id);
            if (player) {
                this.group.remove(player);
                this.players.delete(id);
                player.destroy();
            }
        });

        socket.emit("newPlayer");

        this.add.image(400, 300, 'bg');

    }

    update(time: number, delta: number) {

        //send to server
        

        //local 
        if (this.player) {
            let input = this.getPlayerInput();
            socket.emit("playerInput", input);
            updatePlayer(this.player.pState, input);
            this.player.update();
        }
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

