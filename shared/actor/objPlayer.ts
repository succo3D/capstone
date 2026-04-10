import { GameWorld } from "@shared/world";
import { objActor } from "./objActor";
import { objWeapon } from "../weapon/objWeapon";

const MOVE_SPEED = 300;
const WEAPON_DISTANCE = 32;

export class PlayerInput {
    moveUp: boolean = false;
    moveDown: boolean = false;
    moveLeft: boolean = false;
    moveRight: boolean = false;
    shoot: boolean = false;
    mouseX: number = 0;
    mouseY: number = 0;
}

export class objPlayer extends objActor {

    color: number = 0;
    hp: number = 100;
    armor: number = 0;
    movingAngle: number = -1;
    facingAngle: number = 0;
    weapon: objWeapon = new objWeapon();
    shooting: boolean = false;
    justFired: boolean = false;

    update(delta: number, world: GameWorld) {
        this.moveAndCollide(delta, world.tilemap);
        this.updateWeapon();
        if (this.shooting) {
            this.fireWeapon(world);
        }
    }

    localUpdate(delta: number, tilemap: any) {
        this.moveAndCollide(delta, tilemap);
    }

    updateWeapon() {
        if (!this.weapon)
            return;
        this.weapon.x = this.x + Math.cos(this.facingAngle) * WEAPON_DISTANCE;
        this.weapon.y = this.y + Math.sin(this.facingAngle) * WEAPON_DISTANCE;
    }

    fireWeapon(world: GameWorld) {
        this.justFired = this.weapon.tryFiring(this.facingAngle, world);
    }

    handleInput(input: PlayerInput) {
        this.vx = ((input.moveRight ? 1 : 0) - (input.moveLeft ? 1 : 0)) * MOVE_SPEED;
        this.vy = ((input.moveDown ? 1 : 0) - (input.moveUp ? 1 : 0)) * MOVE_SPEED;
        this.facingAngle = Math.atan2(input.mouseY - this.y, input.mouseX - this.x);
        this.shooting = input.shoot;
    }

    takeDamage(damage: number) {
        this.hp -= damage;
    }
    
}

