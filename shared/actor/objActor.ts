export class objActor {
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(delta: number) {
        this.move(delta);
    }

    move(delta: number) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }

    moveAndCollide(delta: number, tilemap: any) {
        // TODO
        this.move(delta);
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