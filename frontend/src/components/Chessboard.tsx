import { type Color, type PieceSymbol, type Square } from "chess.js"
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ chess, board, socket, setBoard, started, myColor }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    started: boolean;
    myColor: 'white' | 'black';
}) => {
    const [from, setFrom] = useState<null | Square>(null);
    const [, setTo] = useState<null | Square>(null);
    const isFlipped = myColor === 'black';

    return <div className="text-gray-900 ">
        {(isFlipped ? [...board].reverse().map(row => [...row].reverse()) : board).map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    const rank = isFlipped ? i + 1 : 8 - i;
                    const fileIndex = isFlipped ? 7 - j : j;
                    const squareRepresentation = (String.fromCharCode(97 + fileIndex) + "" + rank) as Square;

                    return <div onClick={() => {
                        if (!started) return;
                        if (!from) {
                            setFrom(squareRepresentation);
                        } else {
                            setTo(squareRepresentation);
                            socket.send(JSON.stringify({
                                type: MOVE,
                                payload: {
                                    move: {
                                        from,
                                        to: squareRepresentation
                                    }
                                }
                            }))
                            setFrom(null);
                            chess.move({
                                from,
                                to: squareRepresentation
                            });
                            setBoard(chess.board());
                        }
                    }} key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-green-800' : 'bg-white'}`}>
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col ">
                                {square ? (
                                    <img
                                        className="w-4"
                                        src={
                                            square.color === "b"
                                                ? `/${square.type}.png`
                                                : `/${square.type.toUpperCase()} Chess Pieces.png`
                                        }
                                        alt=""
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        })}
    </div>
}