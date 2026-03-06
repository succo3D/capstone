export const TICK_RATE = 60;
export const FIXED_DELTA = 1 / TICK_RATE;

export class PlayerState {
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;
    facingAngle: number = 0;
    moveSpeed = 3;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class PlayerInput {
    moveUp: boolean = false;
    moveDown: boolean = false;
    moveLeft: boolean = false;
    moveRight: boolean = false;
    shoot: boolean = false;
    mouseX: number = 0;
    mouseY: number = 0;
}

export function updatePlayer(player: PlayerState, input: PlayerInput): void {
    player.x += ((input.moveRight ? 1 : 0) - (input.moveLeft ? 1 : 0)) * player.moveSpeed;
    player.y += ((input.moveDown ? 1 : 0) - (input.moveUp ? 1 : 0)) * player.moveSpeed;
}