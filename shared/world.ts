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
    timeLeft: number;
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

    startIndex = 0;
    starts: number[][] = [
        [1024/5, 768/2],
        [1024/5 * 2, 768/2],
        [1024/5 * 3, 768/2],
        [1024/5 * 4, 768/2]
    ];

    players: Record<string, objPlayer> = {};
    projectiles: Record<string, objProjectile> = {};
    playerInputs: QueuedInput[] = [];
    timeLeft: number = 0;
    matchOver: boolean = false;

    constructor(time: number) {
        this.timeLeft = time;
    }

    update(delta: number): void {

        if (this.matchOver)
            return;

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
                    if (this.players[pid].hp <= 0) {
                        this.players[this.projectiles[id].ownerId].score += 1;
                    }
                    delete this.projectiles[id];
                    break;
                }

            }

        }

        this.timeLeft -= delta;
        if (this.timeLeft <= 0) {
            this.matchOver = true;
        }

    }

    getSnapshot(): WorldSnapshot {
        return {players: this.players, projectiles: this.projectiles, tilemap: this.tilemap, timeLeft: this.timeLeft};
    }

    getResults(): string {

        let highestScore = 0;
        let bestPlayer = "";
        let playerCount = 0;
        let tieCount = 0;

        for (let pid of Object.keys(this.players)) {

            playerCount += 1;

            if (this.players[pid].score > highestScore) {
                highestScore = this.players[pid].score;
                bestPlayer = pid;
            }
            else if(this.players[pid].score == highestScore)
                tieCount += 1;

        }

        if (tieCount == playerCount)
            return "TIE!";

        return bestPlayer;
    }

    addPlayer(id: string, startIndex: number = -1): objPlayer {

        let x = 0;
        let y = 0;

        if (startIndex == -1) {
            let rand = Math.floor(Math.random() * 4);
            x = this.starts[rand][0];
            y = this.starts[rand][1];
        }
        else {
            x = this.starts[startIndex][0];
            y = this.starts[startIndex][1];
        }


        let player = new objPlayer(x, y);
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