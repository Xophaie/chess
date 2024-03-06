import arbiter from "../../arbiter/arbiter";
import { useChess } from "../../contexts/ChessContext";
import styles from "./Pieces.module.css";

function Piece({ piece, rank, file }) {
	const { position, dispatch, turn } = useChess();
	const currentPosition = position[position.length - 1];

	function onDragStart(e) {
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", `${piece} ${rank} ${file}`);
		setTimeout(() => (e.target.style.display = "none"), 0);

		if (turn === piece[0]) {
			const candidateMoves = arbiter.getRegularMoves({
				position: currentPosition,
				piece,
				rank,
				file,
			});
			dispatch({
				type: "candidateMoves/generate",
				payload: candidateMoves,
			});
		}
	}

	function onDragEnd(e) {
		e.target.style.display = "block";
	}

	return (
		<div
			className={`${styles.piece} ${styles[piece]} ${
				styles[`p-${file}${rank}`]
			}`}
			onDragEnd={onDragEnd}
			data-piece={piece}
			draggable='true'
			onDragStart={onDragStart}
		></div>
	);
}

export default Piece;
