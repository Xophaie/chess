import { useChess } from "../../contexts/ChessContext";
import styles from "./Pieces.module.css";
import Piece from "./Piece";
import { useRef } from "react";

import { copyPosition } from "../../utils";
import arbiter from "../../arbiter/arbiter";

function Pieces() {
	const { position, dispatch, turn, candidateMoves } = useChess();
	const currentPosition = position[position.length - 1];

	const ref = useRef();

	const calcCoords = e => {
		const { width, left, top } = ref.current.getBoundingClientRect();
		const size = width / 8;
		const y = Math.floor((e.clientX - left) / size);
		const x = 7 - Math.floor((e.clientY - top) / size);
		return { x, y };
	};

	function move(e) {
		const { x, y } = calcCoords(e);

		const [p, rank, file] = e.dataTransfer.getData("text").split(" ");

		if (candidateMoves?.find(coord => coord[0] === x && coord[1] === y)) {
			if ((p === "wp" && x === 7) || (p === "bp" && x === 0)) {
				dispatch({
					type: "piece/promoting",
					payload: { rank: Number(rank), file: Number(file), x, y },
				});
				return;
			}
			const newPosition = arbiter.performMove({
				position: currentPosition,
				p,
				rank,
				file,
				x,
				y,
			});

			dispatch({ type: "piece/moved", payload: newPosition });
		}

		dispatch({ type: "candidateMoves/clear" });
	}

	function onDrop(e) {
		const newPosition = copyPosition(currentPosition);
		const { x, y } = calcCoords(e);

		move(e);
	}

	function onDragOver(e) {
		e.preventDefault();
	}

	return (
		<div
			ref={ref}
			className={styles.pieces}
			onDrop={onDrop}
			onDragOver={onDragOver}
		>
			{currentPosition.map((r, rank) =>
				r.map((f, file) =>
					currentPosition[rank][file] ? (
						<Piece
							piece={currentPosition[rank][file]}
							key={rank + "" + file}
							rank={rank}
							file={file}
						/>
					) : null
				)
			)}
		</div>
	);
}

export default Pieces;
