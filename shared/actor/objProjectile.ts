import { objActor } from "./objActor";
import { objPlayer } from "./objPlayer";

export class objProjectile extends objActor {

    static idCount: number = 0;

    ownerId: string = "";
    damage: number = 0;
    speed: number = 600;
    direction: number = 0;
    lifetime: number = 1;

    constructor(x: number, y: number, direction: number, ownerId: string) {
        super(x, y)
        this.direction = direction;
        this.ownerId = ownerId;
        this.setVelocity(this.speed, direction);
    }

    update(delta: number, world: any): boolean {
        this.move(delta);
        this.lifetime -= delta;
        if (this.lifetime <= 0) {
            return false;
        }
        return true;
    }

    hitPlayer(player: objPlayer) {
        player.takeDamage(this.damage);
    }
    
}