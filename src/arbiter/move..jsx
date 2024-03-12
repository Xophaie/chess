import { useChess } from "../contexts/ChessContext";
import { copyPosition } from "../utils";

export function movePawn({ position, p, rank, file, x, y }) {
	const newPosition = copyPosition(position);
	if (!newPosition[x][y] && x !== rank && y !== file) newPosition[rank][y] = "";

	newPosition[rank][file] = "";
	newPosition[x][y] = p;
	return newPosition;
}

export function movePiece({
	position,
	p,
	rank,
	file,
	x,
	y,
	castlingDirection,
}) {
	const newPosition = copyPosition(position);

	if (p.endsWith("k") && Math.abs(y - file) === 2 && x !== rank) {
		if (y === 2) {
			newPosition[rank][0] = "";
			newPosition[rank][3] = p.startsWith("w") ? "wr" : "br";
			p.startsWith("w")
				? (castlingDirection.w = "none")
				: (castlingDirection.b = "none");
		}

		if (y === 6) {
			newPosition[rank][7] = "";
			newPosition[rank][5] = p.startsWith("w") ? "wr" : "br";
			p.startsWith("w")
				? (castlingDirection.w = "none")
				: (castlingDirection.b = "none");
		}
	}

	newPosition[rank][file] = "";
	newPosition[x][y] = p;
	return newPosition;
}
