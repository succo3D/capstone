import { GameWorld } from "@shared/world";

export class Match {

    game!: GameWorld;
    started = false;
    ended = false;
    playerCount = 0;
    countdown = 10;
    matchSeconds = 30;

    update(delta: number) {

        if (this.playerCount > 1) {
            this.countdown -= delta;

            if (this.countdown <= 0) {
                this.started = true;
                this.game = new GameWorld(this.matchSeconds);
            }

        }
    }

    updateGame(delta: number) {
        this.game.update(delta);
        if (this.game.timeLeft <= 0) {
            this.ended = true;
        }
    }

    getString() {
        let string = "Players: " + this.playerCount + "/4\n";
        if (this.playerCount > 1)
            string += "Starting In... " + Math.ceil(this.countdown);
        return string;
    }

    getResults() {
        return this.game.getResults();
    }

}
