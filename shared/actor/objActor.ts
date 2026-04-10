import { GameWorld } from "@shared/world";

export class objActor {
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;
    boxW: number = 0;
    boxH: number = 0;

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

        if (!tilemap)
            return false;

        if (this.collidingTilemap(tilemap))
            return true;

        let collided = false;
        
        this.x += this.vx * delta;
        while(this.collidingTilemap(tilemap)) {
            this.x -= Math.sign(this.vx);
            collided = true;
        }

        this.y += this.vy * delta;
        while(this.collidingTilemap(tilemap)) {
            this.y -= Math.sign(this.vy);
            collided = true;
        }

        return collided;
    }

    collidingTilemap(tilemap: any): boolean {
        let tx = this.x / 64;
        let ty = this.y / 64;
        let tw = this.boxW / 64 / 2;
        let th = this.boxH / 64 / 2;

        if (tilemap[Math.floor(ty-th)][Math.floor(tx-tw)])
            return true;
        if (tilemap[Math.floor(ty+th)][Math.floor(tx-tw)])
            return true;
        if (tilemap[Math.floor(ty-th)][Math.floor(tx+tw)])
            return true;
        if (tilemap[Math.floor(ty+th)][Math.floor(tx+tw)])
            return true;

        return false;
    }

    collidingActor(other: objActor): boolean {
        return (
            this.x-this.boxW/2 < other.x+other.boxW/2 &&
            this.x+this.boxW/2 > other.x-other.boxW/2 &&
            this.y-this.boxH/2 < other.y+other.boxH/2 &&
            this.y+this.boxH/2 > other.y-other.boxH/2
        );
    }

}