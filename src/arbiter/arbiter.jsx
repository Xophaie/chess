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
import { areSameTilesColor, findPieceCoords } from "../utils";

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

	isStalemate: function ({
		newPosition,
		enemy,
		castlingDirection,
		position,
		positions,
	}) {
		const isInCheck = this.isChecked({
			positionAfterMove: newPosition,
			position,
			positions,
			castlingDirection,
			player: enemy,
		});

		if (isInCheck) return false;

		const pieces = getPieces({ positionAfterMove: newPosition, enemy });

		const moves = pieces.reduce(
			(acc, p) =>
				(acc = [
					...acc,
					...this.getValidMoves({
						position: newPosition,
						piece: p.piece,
						castlingDirection,
						rank: p.rank,
						file: p.file,
						prevPosition: positions?.[positions?.length - 2],
					}),
				]),
			[]
		);

		return !isInCheck && moves.length === 0;
	},

	isCheckmate: function ({
		newPosition,
		enemy,
		castlingDirection,
		position,
		positions,
	}) {
		const isInCheck = this.isChecked({
			positionAfterMove: newPosition,
			position,
			positions,
			castlingDirection,
			player: enemy,
		});

		const pieces = getPieces({ positionAfterMove: newPosition, enemy });

		const moves = pieces.reduce(
			(acc, p) =>
				(acc = [
					...acc,
					...this.getValidMoves({
						position: newPosition,
						piece: p.piece,
						castlingDirection,
						rank: p.rank,
						file: p.file,
						prevPosition: positions?.[positions?.length - 2],
					}),
				]),
			[]
		);

		return isInCheck && moves.length === 0;
	},

	insufficientMaterial: function ({ newPosition }) {
		const pieces = newPosition.reduce(
			(acc, rank) => (acc = [...acc, ...rank.filter(x => x)]),
			[]
		);

		if (pieces.length === 2) return true;
		if (
			pieces.length === 3 &&
			pieces.some(p => p.endsWith("n") || p.endsWith("b"))
		)
			return true;

		if (
			pieces.length === 4 &&
			pieces.every(p => p.endsWith("b") || p.endsWith("k")) &&
			new Set(pieces).size === 4 &&
			areSameTilesColor(
				findPieceCoords(newPosition, "wb")[0],
				findPieceCoords(newPosition, "bb")[0]
			)
		)
			return true;
		return false;
	},

	performMove: function ({ position, p, rank, file, x, y, castlingDirection }) {
		if (p.endsWith("p")) {
			return movePawn({ position, p, rank, file, x, y });
		} else {
			return movePiece({ position, p, rank, file, x, y, castlingDirection });
		}
	},
};

export default arbiter;
