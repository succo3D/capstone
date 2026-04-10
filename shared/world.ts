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
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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
            player.update(delta, this);
        }

        for (let id of Object.keys(this.projectiles)) {
            if (this.projectiles[id].update(delta, this) == false) {
                delete this.projectiles[id];
            }
        }
    }

    getSnapshot(): WorldSnapshot {
        return {players: this.players, projectiles: this.projectiles, tilemap: this.tilemap};
    }

    addPlayer(id: string): objPlayer {
        let player = new objPlayer(200, 300);
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