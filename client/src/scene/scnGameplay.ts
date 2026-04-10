import { network } from "../network";
import { sprPlayer } from "../sprite/sprPlayer";
import type { Socket } from "socket.io-client";
import { GameWorld, type WorldSnapshot } from "@shared/world";
import { objPlayer, PlayerInput } from "@shared/actor/objPlayer";
import { sprProjectile } from "../sprite/sprProjectile";

let socket: Socket;

let keyA: Phaser.Input.Keyboard.Key;
let keyW: Phaser.Input.Keyboard.Key;
let keyS: Phaser.Input.Keyboard.Key;
let keyD: Phaser.Input.Keyboard.Key;

export default class SceneGameplay extends Phaser.Scene {

    tilemap!: number[][];
    player!: sprPlayer;
    players: Map<string, sprPlayer> = new Map();
    projectiles: Map<string, sprProjectile> = new Map();
    group!: Phaser.GameObjects.Group;
    debug: boolean = false;

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image("weapon", "assets/weapon.png");
        this.load.image("tile", "assets/tile.png");
    }

    create() {

        if (this.input.keyboard) {
            keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        }

        this.group = this.add.group({runChildUpdate: false});

        network.connect();
        socket = network.getSocket();

        socket.on("snapshot", (snapshot: WorldSnapshot) => {

            if (!this.tilemap)
                this.updateTilemap(snapshot.tilemap);

            let players = snapshot.players;
            for (let id of Object.keys(players)) {
                let player = this.players.get(id);
                let state = players[id];
                if(!player) {
                    let newPlayer = new sprPlayer(this, state);
                    this.players.set(id, newPlayer);
                    this.group.add(newPlayer, true);
                }
                else {
                    player.updateState(state);
                    player.update();
                }
            }

            let projectiles = snapshot.projectiles;

            for (let [id, projectile] of this.projectiles) {
                if(!(id in projectiles)) {
                    this.group.remove(projectile);
                    this.projectiles.delete(id);
                    projectile.destroy();
                }
            }

            for (let id of Object.keys(projectiles)) {
                let projectile = this.projectiles.get(id);
                let obj = projectiles[id];
                if(!projectile) {
                    let newProj = new sprProjectile(this, obj);
                    this.projectiles.set(id, newProj);
                    this.group.add(newProj, true);
                }
                else if(projectile) {
                    projectile.update(obj);
                }

            }



        });

        socket.on("newPlayer", (state, id) => {
            let newPlayer = new sprPlayer(this, state);
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

        this.add.image(1024/2, 768/2, 'bg');

    }

    updateTilemap(tilemap: any) {

        this.tilemap = tilemap;

        for (let i = 0; i < tilemap.length; i++) {
            for (let j = 0; j < tilemap[0].length; j++) {
                if (tilemap[i][j])
                    this.add.sprite(64 * j + 32, 64 * i + 32, "tile");
            }
        }


    }

    update(time: number, delta: number) {

        //local update player, send input
        if (this.player) {
            
            let input = this.getPlayerInput();
            socket.emit("playerInput", input);

            this.player.obj.handleInput(input);
            this.player.obj.localUpdate(delta / 1000, this.tilemap);
            this.player.update();
        }
    }

    getPlayerInput() {

        var cursorKeys = this.input.keyboard?.createCursorKeys();

        let playerInput = new PlayerInput;

        if (cursorKeys) {
            playerInput.moveUp = keyW.isDown;
            playerInput.moveDown = keyS.isDown;
            playerInput.moveLeft = keyA.isDown;
            playerInput.moveRight = keyD.isDown;
        }

        playerInput.mouseX = this.game.input.mousePointer?.x ?? 0;
        playerInput.mouseY = this.game.input.mousePointer?.y ?? 0;
        playerInput.shoot = this.game.input.mousePointer?.leftButtonDown() ?? false;

        return playerInput;

    }
}

