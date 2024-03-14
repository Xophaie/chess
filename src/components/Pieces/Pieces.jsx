import { useChess } from "../../contexts/ChessContext";
import styles from "./Pieces.module.css";
import Piece from "./Piece";
import { useRef } from "react";

import { copyPosition, getNewMoveNotation } from "../../utils";
import arbiter from "../../arbiter/arbiter";

function Pieces() {
	const {
		position,
		dispatch,
		turn,
		candidateMoves,
		castlingDirection,
		positions,
	} = useChess();
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

		const enemy = p.startsWith("w") ? "b" : "w";

		if (x === Number(rank) && y === Number(file)) return;

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
				castlingDirection,
			});

			if (
				p.endsWith("r") &&
				Number(rank) % 7 === 0 &&
				Number(file) === 0 &&
				castlingDirection[p[0]] === "both"
			)
				castlingDirection[p[0]] = "right";

			if (
				p.endsWith("r") &&
				Number(rank) % 7 === 0 &&
				Number(file) === 0 &&
				castlingDirection[p[0]] === "left"
			)
				castlingDirection[p[0]] = "none";

			if (
				p.endsWith("r") &&
				Number(rank) % 7 === 0 &&
				Number(file) === 7 &&
				castlingDirection[p[0]] === "both"
			)
				castlingDirection[p[0]] = "left";

			if (
				p.endsWith("r") &&
				Number(rank) % 7 === 0 &&
				Number(file) === 7 &&
				castlingDirection[p[0]] === "right"
			)
				castlingDirection[p[0]] = "none";

			if (p === "bk") {
				castlingDirection.b = "none";
			}

			if (p === "wk") {
				castlingDirection.w = "none";
			}
			const newMove = getNewMoveNotation({
				p,
				rank,
				file,
				x,
				y,
				position: currentPosition,
			});

			dispatch({
				type: "piece/moved",
				payload: { newPosition, newMove },
			});

			if (arbiter.insufficientMaterial({ newPosition })) {
				dispatch({ type: "game/insufficient-material" });
			} else if (
				arbiter.isStalemate({
					newPosition,
					enemy,
					castlingDirection: castlingDirection[enemy],
					position,
					positions,
				})
			) {
				dispatch({ type: "game/stalemate" });
			}

			if (
				arbiter.isCheckmate({
					newPosition,
					enemy,
					castlingDirection,
					position,
					positions,
				})
			) {
				console.log(
					arbiter.isCheckmate({
						newPosition,
						enemy,
						castlingDirection,
						position,
						positions,
					})
				);
				enemy === "b"
					? dispatch({ type: "game/white-won" })
					: dispatch({ type: "game/black-won" });
			}
		}

		dispatch({ type: "candidateMoves/clear" });
	}

	function onDrop(e) {
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
