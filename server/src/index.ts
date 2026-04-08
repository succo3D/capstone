import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { FIXED_DELTA } from "@shared/defines";
import { GameWorld } from "@shared/world";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const game = new GameWorld();

io.on("connection", (socket) => {

  socket.on("newPlayer", () => {
    console.log("New guy joined");
    let player = game.addPlayer(socket.id);
    socket.emit("newPlayer", player, socket.id);
    io.emit("snapshot", game.getSnapshot());
  });

  socket.on("playerInput", (playerInput) => {
    game.queueInput(socket.id, playerInput);
  });

  socket.on("disconnect", () => {
    console.log("A guy left");
    game.removePlayer(socket.id);
    io.emit("playerDisconnected", socket.id);
  });
  
});

  setInterval( () => {

    game.update(FIXED_DELTA);

    io.emit("snapshot", game.getSnapshot());

  }, 1000 / 60);

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});