import { WebSocket } from "ws";
import {Chess} from 'chess.js';
import { GAME_OVER, INIT_GAME, MOVE } from "./messages"; 
export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private moves: string[];
    private startTime:Date;
    private moveCount=0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'white'
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'black'
            }
        })  
        )

    }
    makesMove(socket: WebSocket, move: {
        from: string; 
        to: string;
    }) {
        // validate the type of move using zod - TODO

        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("Not player 1's turn");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("Not player 2's turn");
            return;
        }

        try {
            this.board.move(move);
        } catch(e) {
            console.log("Invalid move", e);
            return;
        }

        // check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            const gameOverMessage = JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: winner
                }
            });
            this.player1.send(gameOverMessage);
            this.player2.send(gameOverMessage);
            return;
        }

        // send the updated board to the other player
        // formatting the move message
        const moveMessage = JSON.stringify({
            type: MOVE,
            payload: move
        });

        if (this.moveCount % 2 === 0) {
            // Player 1 played, inform Player 2
            this.player2.send(moveMessage);
        } else {
            // Player 2 played, inform Player 1
            this.player1.send(moveMessage);
        }

        this.moveCount++;
    }

}