import Phaser from "phaser";
import { PlayerState } from "@shared/defines"

export class PlayerObject extends Phaser.GameObjects.Sprite {

    pState: PlayerState;

    constructor(scene: Phaser.Scene, playerState: PlayerState, texture: string | Phaser.Textures.Texture, frame?: string | number) {
        super(scene, playerState.x, playerState.y, texture, frame);
        this.pState = playerState;
    }

    update() {
        //TODO INTERPOLATE TO STATE POSITION?
        this.setPosition(this.pState.x, this.pState.y);
    }

}