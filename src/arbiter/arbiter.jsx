import {
	getBishopMoves,
	getCastlingMoves,
	getKingMoves,
	getKingPosition,
	getKnightMoves,
	getPawnMoves,
	getPieces,
	getQueenMoves,
	getRookMoves,
} from "./getMoves";
import { movePawn, movePiece } from "./move.";

const arbiter = {
	getRegularMoves: function ({
		position,
		piece,
		rank,
		file,
		positions,
		castlingDirection,
	}) {
		if (piece.endsWith("r"))
			return getRookMoves({ position, piece, rank, file });
		if (piece.endsWith("n")) return getKnightMoves({ position, rank, file });
		if (piece.endsWith("b"))
			return getBishopMoves({ position, rank, file, piece });
		if (piece.endsWith("q"))
			return getQueenMoves({ position, rank, file, piece });
		if (piece.endsWith("k"))
			return getKingMoves({
				position,
				rank,
				file,
				piece,
				castlingDirection,
				positions,
			});
		if (piece.endsWith("p"))
			return getPawnMoves({
				position,
				rank,
				file,
				piece,
				positions,
			});
	},

	getValidMoves: function ({
		position,
		piece,
		rank,
		file,
		positions,
		castlingDirection,
	}) {
		let moves = this.getRegularMoves({
			position,
			piece,
			rank,
			file,
			positions,
			castlingDirection,
		});

		const notInCheckMoves = [];

		if (piece.endsWith("k"))
			moves = [
				...moves,
				...getCastlingMoves({
					position,
					castlingDirection,
					piece,
					rank,
					file,
				}),
			];

		moves.forEach(([x, y]) => {
			const positionAfterMove = this.performMove({
				position,
				p: piece,
				rank,
				file,
				x,
				y,
				castlingDirection,
			});

			if (
				!this.isChecked({
					positionAfterMove,
					position,
					player: piece[0],
					piece,
					rank,
					file,
					positions,
					castlingDirection,
				})
			)
				notInCheckMoves.push([x, y]);
		});

		return notInCheckMoves;
	},

	isChecked: function ({
		positionAfterMove,
		position,
		positions,
		castlingDirection,
		player,
	}) {
		const enemy = player.startsWith("w") ? "b" : "w";
		let kingPosition = getKingPosition({ positionAfterMove, player });
		const enemyPieces = getPieces({ positionAfterMove, enemy });

		const enemyMoves = enemyPieces.reduce((acc, p) => {
			return [
				...acc,
				...this.getRegularMoves({
					position: positionAfterMove,
					piece: p.piece,
					castlingDirection,
					rank: p.rank,
					file: p.file,
					prevPosition: positions?.[positions?.length - 2],
				}),
			];
		}, []);

		if (
			enemyMoves.some(
				([x, y]) => kingPosition[0] === x && kingPosition[1] === y
			)
		)
			return true;
		return false;
	},

	performMove: function ({ position, p, rank, file, x, y, castlingDirection }) {
		console.log(p);
		if (p.endsWith("p")) {
			return movePawn({ position, p, rank, file, x, y });
		} else {
			return movePiece({ position, p, rank, file, x, y, castlingDirection });
		}
	},
};

export default arbiter;
