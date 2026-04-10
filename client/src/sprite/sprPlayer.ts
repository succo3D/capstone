import Phaser from "phaser";
import { objPlayer } from "@shared/actor/objPlayer";

export class sprPlayer extends Phaser.GameObjects.Sprite {

    obj: objPlayer;
    line: Phaser.GameObjects.Line;

    constructor(scene: Phaser.Scene, obj: any) {
        super(scene, obj.x, obj.y, "player");
        this.obj = new objPlayer(0,0);
        this.updateState(obj);
        this.line = this.scene.add.line(this.x, this.y, 0, 0, 0, 0, 0xff0000, 1.0);
    }

    updateState(state: any) {
        this.obj = Object.assign(this.obj, state);
    }

    update() {
        this.setPosition(this.obj.x, this.obj.y);
        this.line.setPosition(this.x, this.y);
        this.line.setTo(0, 0, Math.cos(this.obj.facingAngle) * 64, Math.sin(this.obj.facingAngle) * 64);
        if (this.obj.shooting)
            this.line.strokeColor = 0x0000ff;
        else
            this.line.strokeColor = 0xff0000;
    }

    destroy(fromScene?: boolean): void {
        this.line.destroy();
        super.destroy(fromScene);
    }

}