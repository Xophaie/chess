import { copyPosition } from "../utils";

export function movePawn({ position, p, rank, file, x, y }) {
	const newPosition = copyPosition(position);
	if (!newPosition[x][y] && x !== rank && y !== file) newPosition[rank][y] = "";

	newPosition[rank][file] = "";
	newPosition[x][y] = p;
	return newPosition;
}

export function movePiece({ position, p, rank, file, x, y }) {
	const newPosition = copyPosition(position);

	newPosition[rank][file] = "";
	newPosition[x][y] = p;
	return newPosition;
}
