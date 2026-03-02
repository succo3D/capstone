import {io, Socket} from "socket.io-client";

class NetworkBuddy {
    private socket: Socket | null = null;

    connect() {
        // don't do anything if socket already connected
        if (this.socket) return;

        this.socket = io();

        this.socket.on("connect", () => {
            console.log("Connected:", this.socket?.id);
        })
    }

    getSocket(): Socket {
        if (!this.socket) throw new Error("Socket not initialized. Call connect() first.");
        return this.socket;
    }

}

export const network = new NetworkBuddy();