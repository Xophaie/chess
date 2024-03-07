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

export function getKingMoves({ position, rank, file, piece }) {
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
export function getPawnMoves({ position, rank, file, piece, prevPosition }) {
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

	const enemyPawn = piece[0] === "w" ? "bp" : "wp";
	const enPassantMoves = [file - 1, file + 1];
	console.log(position);

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
