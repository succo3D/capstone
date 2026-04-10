import { GameWorld } from "@shared/world";

export class objActor {
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(delta: number, game: GameWorld) {
        this.move(delta);
    }

    move(delta: number) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }

    setVelocity(speed: number, direction: number) {
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
    }

    moveAndCollide(delta: number, tilemap: any) {
        // TODO
        this.move(delta);
        return false;
    }

    collidingTilemap(tilemap: any): number {
        // TODO
        return 0;
    }

    collidingActor(other: objActor): boolean {
        // TODO
        return false;
    }

}