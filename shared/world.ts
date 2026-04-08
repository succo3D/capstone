import { objPlayer, PlayerInput } from "./actor/objPlayer";

type QueuedInput = {
    id: string;
    input: PlayerInput;
}

export type WorldSnapshot = {
    players: Record<string, objPlayer>;
}

export class GameWorld {
    players: Record<string, objPlayer> = {};
    playerInputs: QueuedInput[] = [];

    update(delta: number): void {

        while (this.playerInputs.length > 0) {
            const {id, input} = this.playerInputs.shift();
            const player = this.players[id];
            if (player) player.handleInput(input);
        }

        for (const [id, player] of Object.entries(this.players)) {
            player.update(delta);
        }
    }

    getSnapshot(): WorldSnapshot {
        return {players: this.players};
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