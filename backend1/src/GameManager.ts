import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";


export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[]

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    AddUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket)

    }
    RemoveUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        // Stop the game here because the opponent disconnected
        // detailed handling logic to be added
        console.log("User removed");
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());

                if (message.type === INIT_GAME) {
                    if (this.pendingUser) {
                        // exists -> start game
                        const game = new Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.pendingUser = null;
                    } else {
                        this.pendingUser = socket;
                    }
                }

                if (message.type === MOVE) {
                    const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        game.makesMove(socket, message.payload.move);
                    }
                }
            } catch (e) {
                console.error("Error handling message:", e);
                return;
            }
        });
    }
}