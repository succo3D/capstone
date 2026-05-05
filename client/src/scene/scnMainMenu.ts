import { network } from "../network";
import type { Socket } from "socket.io-client";

let socket: Socket;


export default class SceneMainMenu extends Phaser.Scene {


    preload() {

    }


    create() {

        network.connect();
        socket = network.getSocket();

    }

    update(time: number, delta: number) {



    }

}