import { objPlayer, PlayerInput } from "./actor/objPlayer";
import { objProjectile } from "./actor/objProjectile";

type QueuedInput = {
    id: string;
    input: PlayerInput;
}

export type WorldSnapshot = {
    players: Record<string, objPlayer>;
    projectiles: Record<string, objProjectile>;
    tilemap: number[][];
}

export class GameWorld {
    tilemap: number[][] = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    players: Record<string, objPlayer> = {};
    projectiles: Record<string, objProjectile> = {};
    playerInputs: QueuedInput[] = [];

    update(delta: number): void {

        while (this.playerInputs.length > 0) {
            const queuedInput = this.playerInputs.shift();
            if (!queuedInput) break;
            const {id, input} = queuedInput;
            const player = this.players[id];
            if (player) player.handleInput(input);
        }

        for (const [id, player] of Object.entries(this.players)) {
            if (!player.update(delta, this)) {
                this.removePlayer(id);
                this.addPlayer(id);
            }
        }

        for (let id of Object.keys(this.projectiles)) {
            if (!this.projectiles[id].update(delta, this)) {
                delete this.projectiles[id];
                break;
            }

            for (let pid of Object.keys(this.players)) {

                if (this.projectiles[id].collidingActor(this.players[pid])) {
                    this.projectiles[id].hitPlayer(this.players[pid]);
                    delete this.projectiles[id];
                    break;
                }

            }

        }

    }

    getSnapshot(): WorldSnapshot {
        return {players: this.players, projectiles: this.projectiles, tilemap: this.tilemap};
    }

    addPlayer(id: string): objPlayer {
        let player = new objPlayer(1024/2, 768/2);
        player.id = id;
        this.players[id] = player;
        return player;
    }

    removePlayer(id: string): void {
        delete this.players[id];
    }

    queueInput(id: string, input: PlayerInput): void {
        this.playerInputs.push({id: id, input: input});
    }
}