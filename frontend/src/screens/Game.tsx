import { ChessBoard } from "../components/Chessboard";
import { Button } from "../components/Button";
import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const [chess, setChess] = useState(new Chess());
  const socket = useSocket();
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [color, setColor] = useState<'white' | 'black'>('white');

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          const newChess = new Chess();
          setChess(newChess);
          setBoard(newChess.board());
          setStarted(true);
          // @ts-ignore
          setColor(message.payload.color);
          console.log("Game Initialized");
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");
          break;
        case GAME_OVER:
          console.log("Game Over");
          break;
      }
    };
  }, [socket, chess]);

  if (!socket) return <div>Connecting to server...</div>;

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} started={started} myColor={color} />
          </div>

          <div className="col-span-2 bg-green-200 w-full flex justify-center">
            <div className="pt-8">
              {!started && <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    }))
                }}  >
                khel le bhai
              </Button>}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
