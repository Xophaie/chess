import moveSound from "./assets/moveSound.mp3";
import capture from "./assets/capture.mp3";

export const getCharacter = file => String.fromCharCode(file + 96);
export function createPosition() {
	const position = Array(8)
		.fill("")
		.map(() => Array(8).fill(""));

	for (let i = 0; i < 8; i++) {
		position[6][i] = "bp";
		position[1][i] = "wp";
	}

	position[0][0] = "wr";
	position[0][1] = "wn";
	position[0][2] = "wb";
	position[0][3] = "wq";
	position[0][4] = "wk";
	position[0][5] = "wb";
	position[0][6] = "wn";
	position[0][7] = "wr";

	position[7][0] = "br";
	position[7][1] = "bn";
	position[7][2] = "bb";
	position[7][3] = "bq";
	position[7][4] = "bk";
	position[7][5] = "bb";
	position[7][6] = "bn";
	position[7][7] = "br";

	return position;
}

export function copyPosition(position) {
	const newPosition = Array(8)
		.fill("")
		.map(() => Array(8).fill(""));

	for (let rank = 0; rank < 8; rank++) {
		for (let file = 0; file < 8; file++) {
			newPosition[rank][file] = position[rank][file];
		}
	}
	return newPosition;
}

export function areSameTilesColor(coords1, coords2) {
	if ((coords1.x + coords1.y) % 2 === (coords2.x + coords2.y) % 2) return true;
	return false;
}

export function findPieceCoords(position, piece) {
	let results = [];
	position.forEach((rank, i) => {
		rank.forEach((tile, j) => {
			if (tile === piece) results.push({ x: i, y: j });
		});
	});
	return results;
}

export function playSound(type) {
	const sound = new Audio(type === "capture" ? capture : moveSound);
	sound.play();
}

export function getNewMoveNotation({
	p,
	rank,
	file,
	x,
	y,
	position,
	promotesTo,
}) {
	let note = "";

	rank = Number(rank);
	file = Number(file);

	if (p[1] === "k" && Math.abs(y - file) === 2) {
		if (file > y) return "O-O";
		else return "O-O-O";
	}

	if (!p.endsWith("p")) {
		note += p[1].toUpperCase();
		if (position[x][y]) {
			note += "x";
		}
	} else {
		if (rank !== x && file !== y) {
			note += getCharacter(file + 1) + "x";
		}
	}

	note += getCharacter(y + 1) + (x + 1);

	if (promotesTo) {
		note += "=" + promotesTo.toUpperCase();
	}

	return note;
}
