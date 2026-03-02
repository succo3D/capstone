import Phaser from "phaser";
import { PlayerState } from "@shared/defines"

export class PlayerObject extends Phaser.GameObjects.Sprite {

    pState: PlayerState;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.pState = new PlayerState(x, y);
    }

    update(time: number, delta: number) {
        //TODO INTERPOLATE TO STATE POSITION?
        this.setPosition(this.pState.x, this.pState.y);
    }

}