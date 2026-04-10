import Phaser from "phaser";
import { objPlayer } from "@shared/actor/objPlayer";

export class sprPlayer extends Phaser.GameObjects.Sprite {

    obj: objPlayer;
    line!: Phaser.GameObjects.Line;
    weapon: Phaser.GameObjects.Sprite;
    box: Phaser.GameObjects.Rectangle;
    healthBar: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, obj: any) {
        super(scene, obj.x, obj.y, "player");
        this.obj = new objPlayer(0,0);
        this.updateState(obj);
        //this.line = this.scene.add.line(this.x, this.y, 0, 0, 0, 0, 0xff0000, 1.0);
        this.weapon = this.scene.add.sprite(this.x, this.y, "weapon");
        this.box = this.scene.add.rectangle(this.x, this.y, this.obj.boxW, this.obj.boxH, 0xff0000, 0.5);
        this.weapon.setDepth(this.depth + 1);
        this.box.setDepth(this.depth + 2);
        if (!this.scene.debug) {
            this.box.setVisible(false);
        }
        this.healthBar = this.scene.add.graphics();
    }

    updateState(state: any) {
        this.obj = Object.assign(this.obj, state);
    }

    updateHealthBar() {
        const percent = this.obj.hp / 100;

        const width = 40
        const height = 6

        const x = this.x - width / 2
        const y = this.y - 48

        this.healthBar.clear()

        // background
        this.healthBar.fillStyle(0x000000)
        this.healthBar.fillRect(x, y, width, height)

        // color based on HP
        let color = 0x00ff00 // green

        if (percent < 0.6) color = 0xffff00 // yellow
        if (percent < 0.3) color = 0xff0000 // red

        this.healthBar.fillStyle(color)
        this.healthBar.fillRect(x, y, width * percent, height)

        //this.healthBar.setPosition(this.x, this.y);
    }

    update() {
        this.setPosition(this.obj.x, this.obj.y);

        this.weapon.setPosition(this.x + Math.cos(this.obj.facingAngle) * 48, this.y + Math.sin(this.obj.facingAngle) * 48);
        this.weapon.rotation = this.obj.facingAngle;
        this.weapon.flipY = (this.obj.facingAngle > Math.PI/2 || this.obj.facingAngle < -Math.PI/2)

        this.box.setPosition(this.x, this.y);

        this.updateHealthBar();

        /*
        this.line.setPosition(this.x, this.y);
        this.line.setTo(0, 0, Math.cos(this.obj.facingAngle) * 64, Math.sin(this.obj.facingAngle) * 64);
        if (this.obj.shooting)
            this.line.strokeColor = 0x0000ff;
        else
            this.line.strokeColor = 0xff0000;
        */
    }

    destroy(fromScene?: boolean): void {
        //this.line.destroy();
        this.weapon.destroy();
        this.box.destroy();
        this.healthBar.destroy();
        super.destroy(fromScene);
    }

}