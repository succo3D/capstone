import Phaser from "phaser";
import { objPlayer } from "@shared/actor/objPlayer";

export class PlayerObject extends Phaser.GameObjects.Sprite {

    pState: objPlayer;

    constructor(scene: Phaser.Scene, playerState: objPlayer, texture: string | Phaser.Textures.Texture, frame?: string | number) {
        super(scene, playerState.x, playerState.y, texture, frame);
        this.pState = playerState;
    }

    update() {
        //TODO INTERPOLATE TO STATE POSITION?
        this.setPosition(this.pState.x, this.pState.y);
    }

}