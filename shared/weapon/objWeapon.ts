import { objProjectile } from "@shared/actor/objProjectile";
import { GameWorld } from "@shared/world";

export class objWeapon {

    x = 0;
    y = 0;
    ownerId = "";
    cooldown: number = 0;

    fire(direction: number, world: GameWorld) {
        world.projectiles[(objProjectile.idCount++).toString()] = new objProjectile(this.x, this.y, direction, this.ownerId);
        this.cooldown = 10;
    }

    tryFiring(direction: number, world: GameWorld) {
        if (this.cooldown > 0) {
            this.cooldown -= 1;
            return false
        }
        this.fire(direction, world);
        return true
    }

}