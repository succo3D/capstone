import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { PlayerInput, PlayerState, updatePlayer } from "@shared/defines";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

type QueuedInput = {
  id: string
  input: PlayerInput
}

const playerInputs: QueuedInput[] = [];

let players: Record<string, PlayerState> = {};

io.on("connection", (socket) => {

  socket.on("newPlayer", () => {
    console.log("New guy joined");
    let state = new PlayerState(200, 300);
    players[socket.id] = state;
    socket.emit("newPlayer", state, socket.id);
    io.emit("snapshot", players);
  });

  socket.on("playerInput", (playerInput) => {
    playerInputs.push({id: socket.id, input: playerInput})
  });

  socket.on("disconnect", () => {
    console.log("A guy left");
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });
  
});

  setInterval( () => {

    while (playerInputs.length > 0) {
      const {id, input} = playerInputs.shift();
      const player = players[id];
      if (player) updatePlayer(player, input);
    }

    io.emit("snapshot", players);

  }, 1000 / 60);

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});