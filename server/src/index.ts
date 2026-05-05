import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { FIXED_DELTA } from "@shared/defines";
import { GameWorld } from "@shared/world";
import { Match } from "@shared/match";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const match = new Match();

let waitTime = 7

io.on("connection", (socket) => {

  socket.on("joining", () => {
    match.playerCount += 1;
    match.countdown = waitTime;
    socket.emit("joined", match.getString());
    io.emit("matchUpdate", match.getString());
  });

  socket.on("newPlayer", () => {
    console.log("New guy joined");
    let player = match.game.addPlayer(socket.id);
    socket.emit("newPlayer", player, socket.id);
    io.emit("snapshot", match.game.getSnapshot());
  });

  socket.on("playerInput", (playerInput) => {
    match.game.queueInput(socket.id, playerInput);
  });

  socket.on("disconnect", () => {
    console.log("A guy left");
    if (match.started) {
      match.game.removePlayer(socket.id);
      io.emit("playerDisconnected", socket.id);
    }
    else {
      match.playerCount -= 1;
      match.countdown = waitTime;
      io.emit("matchUpdate", match.getString());
    }
  });
  
});

  setInterval( () => {

    if (match.started && !match.ended) {
      match.updateGame(1 / 60);
      io.emit("snapshot", match.game.getSnapshot());
    }
    else if (!match.started && !match.ended) {
      match.update(1 / 60);
      io.emit("matchUpdate", match.getString());
      if (match.started) {
        io.emit("matchStart");
      }
    }
    else if (match.started && match.ended) {
      io.emit("matchOver", match.getResults());
      match.started = false;
    }

  }, 1000 / 60);

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});