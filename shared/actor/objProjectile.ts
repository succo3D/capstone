import { objActor } from "./objActor";
import { objPlayer } from "./objPlayer";

export class objProjectile extends objActor {

    static idCount: number = 0;

    ownerId: string = "";
    damage: number = 10;
    speed: number = 600;
    direction: number = 0;
    lifetime: number = 1
    boxW: number = 16;
    boxH: number = 16;

    constructor(x: number, y: number, direction: number, ownerId: string) {
        super(x, y)
        this.direction = direction;
        this.ownerId = ownerId;
        this.setVelocity(this.speed, direction);
        this.boxW = 16;
        this.boxH = 16;
    }

    update(delta: number, world: any): boolean {
        this.move(delta);
        this.lifetime -= delta;
        if (this.lifetime <= 0)
            return false;
        if (this.collidingTilemap(world.tilemap))
            return false;
        return true;
    }

    hitPlayer(player: objPlayer) {
        player.takeDamage(this.damage);
    }
    
}