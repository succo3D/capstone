import { objActor } from "./objActor";

const MOVE_SPEED = 100;

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

    handleInput(input: PlayerInput) {
        this.vx = ((input.moveRight ? 1 : 0) - (input.moveLeft ? 1 : 0)) * MOVE_SPEED;
        this.vy = ((input.moveDown ? 1 : 0) - (input.moveUp ? 1 : 0)) * MOVE_SPEED;
    }

    takeDamage(damage: number) {
        this.hp -= damage;
    }
    
}

