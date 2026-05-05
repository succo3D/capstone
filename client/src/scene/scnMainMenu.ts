import { network } from "../network";
import type { Socket } from "socket.io-client";
import {UIButton} from "../button";

let socket: Socket;


export default class SceneMainMenu extends Phaser.Scene {

    label!: Phaser.GameObjects.Text;
    button!: UIButton;

    preload() {

    }

    create() {

        this.button = new UIButton(this, 1024/2, 768/2, 400, 300, "Connect!", () => this.tryConnect());
        this.label = this.add.text(1024/2, 600, "").setOrigin(0.5);

    }

    tryConnect() {

        network.connect();
        socket = network.getSocket();

        socket.on("joined", (matchInfo: string) => {

            this.button.visible = false;
            this.label.text = matchInfo;

            socket.on("matchUpdate", (matchInfo: string) => {

                this.label.text = matchInfo;

            });

            socket.on("matchStart", () => {

                this.scene.start("gameplay");

            });

        });

        socket.emit("joining");

    }


}