import arbiter from "./arbiter";
export function getRookMoves({ position, piece, rank, file }) {
	const moves = [];
	const us = piece[0];
	const enemy = us === "w" ? "b" : "w";

	const direction = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	direction.forEach(dir => {
		for (let i = 1; i < 8; i++) {
			const x = rank + i * dir[0];
			const y = file + i * dir[1];
			if (position?.[x]?.[y] === undefined) {
				break;
			}
			if (position[x][y].startsWith(enemy)) {
				moves.push([x, y]);
				break;
			}
			if (position[x][y].startsWith(us)) {
				break;
			}
			moves.push([x, y]);
		}
	});

	return moves;
}

export function getKnightMoves({ position, rank, file }) {
	const moves = [];
	const enemy = position[rank][file].startsWith("w") ? "b" : "w";

	const candidates = [
		[-2, 1],
		[-2, -1],
		[2, 1],
		[2, -1],

		[1, 2],
		[1, -2],
		[-1, 2],
		[-1, -2],
	];

	candidates.forEach(c => {
		const cell = position?.[rank + c[0]]?.[file + c[1]];
		if (cell !== undefined && (cell.startsWith(enemy) || cell === "")) {
			moves.push([rank + c[0], file + c[1]]);
		}
	});

	return moves;
}

export function getBishopMoves({ position, rank, file, piece }) {
	const moves = [];
	const us = piece[0];
	const enemy = us === "w" ? "b" : "w";

	const direction = [
		[-1, 1],
		[-1, -1],
		[1, -1],
		[1, 1],
	];

	direction.forEach(dir => {
		for (let i = 1; i < 8; i++) {
			const x = rank + i * dir[0];
			const y = file + i * dir[1];

			if (position?.[x]?.[y] === undefined) {
				break;
			}
			if (position[x][y].startsWith(enemy)) {
				moves.push([x, y]);
				break;
			}
			if (position[x][y].startsWith(us)) {
				break;
			}
			moves.push([x, y]);
		}
	});

	return moves;
}

export function getQueenMoves({ position, rank, file, piece }) {
	const moves = [];
	const us = piece[0];
	const enemy = us === "w" ? "b" : "w";

	const direction = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, 1],
		[-1, -1],
		[1, -1],
		[1, 1],
	];

	direction.forEach(dir => {
		for (let i = 1; i < 8; i++) {
			const x = rank + i * dir[0];
			const y = file + i * dir[1];

			if (position?.[x]?.[y] === undefined) {
				break;
			}
			if (position[x][y].startsWith(enemy)) {
				moves.push([x, y]);
				break;
			}
			if (position[x][y].startsWith(us)) {
				break;
			}

			moves.push([x, y]);
		}
	});

	return moves;
}

export function getKingMoves({
	position,
	rank,
	file,
	piece,
	positions,
	castlingDirection,
}) {
	const moves = [];
	const us = piece[0];

	const direction = [
		[-1, 1],
		[-1, -1],
		[1, -1],
		[1, 1],

		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	direction.forEach(dir => {
		const x = rank + dir[0];
		const y = file + dir[1];

		if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us)) {
			moves.push([x, y]);
		}
	});

	return moves;
}

export const getCastlingMoves = ({
	position,
	castlingDirection,
	piece,
	rank,
	file,
}) => {
	const moves = [];

	if (file !== 4 || rank % 7 !== 0 || castlingDirection === "none") {
		return moves;
	}

	if (piece.startsWith("w")) {
		if (
			arbiter.isChecked({
				positionAfterMove: position,
				position,
				player: "w",
				piece,
				rank,
				file,
				castlingDirection,
			})
		)
			return moves;
		if (
			["left", "both"].includes(castlingDirection.w) &&
			!position[0][1] &&
			!position[0][2] &&
			!position[0][3] &&
			position[0][0] === "wr" &&
			!arbiter.isChecked({
				positionAfterMove: arbiter.performMove({
					position,
					p: piece,
					rank,
					file,
					x: 0,
					y: 3,
					castlingDirection,
				}),
				player: "w",
			}) &&
			!arbiter.isChecked({
				positionAfterMove: arbiter.performMove({
					position,
					p: piece,
					rank,
					file,
					x: 0,
					y: 2,
					castlingDirection,
				}),
				player: "w",
			})
		) {
			moves.push([0, 2]);
		}

		if (
			["right", "both"].includes(castlingDirection.w) &&
			!position[0][5] &&
			!position[0][6] &&
			position[0][7] === "wr" &&
			!arbiter.isChecked({
				positionAfterMove: arbiter.performMove({
					position,
					p: piece,
					rank,
					file,
					x: 0,
					y: 5,
					castlingDirection,
				}),
				player: "w",
			}) &&
			!arbiter.isChecked({
				positionAfterMove: arbiter.performMove({
					position,
					p: piece,
					rank,
					file,
					x: 0,
					y: 6,
					castlingDirection,
				}),
				player: "w",
			})
		) {
			moves.push([0, 6]);
		}
	}

	if (piece.startsWith("b")) {
		if (
			arbiter.isChecked({
				positionAfterMove: position,
				position,
				player: "b",
				piece,
				rank,
				file,
				castlingDirection,
			})
		)
			return moves;

		if (
			["left", "both"].includes(castlingDirection.b) &&
			!position[7][1] &&
			!position[7][2] &&
			!position[7][3] &&
			position[7][0] === "br" &&
			!arbiter.isChecked({
				positionAfterMove: arbiter.performMove({
					position,
					p: piece,
					rank,
					file,
					x: 7,
					y: 3,
					castlingDirection,
				}),
				player: "b",
			}) &&
			!arbiter.isChecked({
				positionAfterMove: arbiter.performMove({
					position,
					p: piece,
					rank,
					file,
					x: 7,
					y: 2,
					castlingDirection,
				}),
				player: "b",
			})
		) {
			moves.push([7, 2]);
		}

		if (
			["right", "both"].includes(castlingDirection.b) &&
			!position[7][5] &&
			!position[7][6] &&
			position[7][7] === "br" &&
			!arbiter.isChecked({
				positionAfterMove: arbiter.performMove({
					position,
					p: piece,
					rank,
					file,
					x: 7,
					y: 5,
					castlingDirection,
				}),
				player: "b",
			}) &&
			!arbiter.isChecked({
				positionAfterMove: arbiter.performMove({
					position,
					p: piece,
					rank,
					file,
					x: 7,
					y: 6,
					castlingDirection,
				}),
				player: "b",
			})
		) {
			moves.push([7, 6]);
		}
	}

	return moves;
};

export function getPawnMoves({ position, rank, file, piece, positions }) {
	const moves = [];
	const enemy = piece[0] === "w" ? "b" : "w";
	const dir = piece === "wp" ? 1 : -1;

	// ************** Moving without capture **************

	if (position?.[rank + dir]?.[file] === "") {
		if (
			position?.[rank + 2 * dir]?.[file] === "" &&
			(rank === 1 || rank === 6)
		) {
			moves.push([rank + 2 * dir, file]);
		}
		moves.push([rank + dir, file]);
	}

	// ************** Moving with capture **************

	// ///// Capturing left /////
	if (position?.[rank + dir]?.[file - 1]?.startsWith(enemy)) {
		moves.push([rank + dir, file - 1]);
	}

	// ///// Capturing right /////
	if (position?.[rank + dir]?.[file + 1]?.startsWith(enemy)) {
		moves.push([rank + dir, file + 1]);
	}

	// ************** En passant **************

	const prevPosition = positions?.[positions?.length - 2];
	const enemyPawn = piece[0] === "w" ? "bp" : "wp";
	const enPassantMoves = [file - 1, file + 1];

	if (prevPosition) {
		if ((dir === 1 && rank === 4) || (dir === -1 && rank === 3)) {
			enPassantMoves.forEach(file => {
				if (
					position?.[rank]?.[file] === enemyPawn &&
					position?.[rank + 2 * dir]?.[file] === "" &&
					prevPosition?.[rank]?.[file] === "" &&
					prevPosition?.[rank + 2 * dir]?.[file] === enemyPawn
				) {
					moves.push([rank + dir, file]);
				}
			});
		}
	}

	return moves;
}

export function getKingPosition({ positionAfterMove, player }) {
	let kingPosition;
	positionAfterMove.forEach((rank, x) => {
		rank.forEach((file, y) => {
			if (
				positionAfterMove[x][y].endsWith("k") &&
				positionAfterMove[x][y].startsWith(player)
			)
				kingPosition = [x, y];
		});
	});

	return kingPosition;
}

export function getPieces({ positionAfterMove, enemy }) {
	const enemyPieces = [];

	positionAfterMove.forEach((rank, x) => {
		rank.forEach((file, y) => {
			if (positionAfterMove[x][y].startsWith(enemy)) {
				enemyPieces.push({
					piece: positionAfterMove[x][y],
					file: y,
					rank: x,
				});
			}
		});
	});

	return enemyPieces;
}
