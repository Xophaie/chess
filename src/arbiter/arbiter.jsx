import {
	getBishopMoves,
	getKingMoves,
	getKnightMoves,
	getPawnMoves,
	getQueenMoves,
	getRookMoves,
} from "./getMoves";
import { movePawn, movePiece } from "./move.";

const arbiter = {
	getRegularMoves: function ({ position, piece, rank, file, positions }) {
		if (piece.endsWith("r"))
			return getRookMoves({ position, piece, rank, file });
		if (piece.endsWith("n")) return getKnightMoves({ position, rank, file });
		if (piece.endsWith("b"))
			return getBishopMoves({ position, rank, file, piece });
		if (piece.endsWith("q"))
			return getQueenMoves({ position, rank, file, piece });
		if (piece.endsWith("k"))
			return getKingMoves({ position, rank, file, piece });
		if (piece.endsWith("p"))
			return getPawnMoves({
				position,
				rank,
				file,
				piece,
				prevPosition: positions[positions.length - 2],
			});
	},

	performMove: function ({ position, p, rank, file, x, y }) {
		if (p.endsWith("p")) {
			return movePawn({ position, p, rank, file, x, y });
		} else {
			return movePiece({ position, p, rank, file, x, y });
		}
	},
};

export default arbiter;
