import Phaser from "phaser";
import type { objProjectile } from "@shared/actor/objProjectile";

export class sprProjectile extends Phaser.GameObjects.Sprite {

    obj: objProjectile;

    constructor(scene: Phaser.Scene, obj: any) {
        super(scene, obj.x, obj.y, "bullet");
        this.obj = obj;
    }

    update(obj: objProjectile) {
        this.obj = obj;
        this.setPosition(this.obj.x, this.obj.y);
        this.setRotation(this.obj.direction);
    }

}