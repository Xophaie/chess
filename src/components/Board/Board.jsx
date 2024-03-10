import { useChess } from "../../contexts/ChessContext";
import Pieces from "../Pieces/Pieces";
import Popup from "../Popups/Popup";
import styles from "./Board.module.css";
import Files from "./Files";
import Ranks from "./Ranks";

function Board() {
	let { position, candidateMoves } = useChess();
	position = position[position.length - 1];

	const ranks = Array(8)
		.fill("")
		.map((_, i) => 8 - i);

	const files = Array(8)
		.fill("")
		.map((_, j) => String.fromCharCode(96 + (j + 1)));

	function getClassName(i, j) {
		let c = "";

		c += (i + j) % 2 === 0 ? "tile--dark" : "tile--light";

		return c;
	}

	function getExtendedClassName(i, j) {
		let cExt = "";
		if (candidateMoves?.find(coord => coord[0] === i && coord[1] === j)) {
			if (position[i][j]) {
				cExt += "attacking";
			} else {
				cExt += "highlight";
			}
		}
		return cExt;
	}

	return (
		<div className={styles.board}>
			<Ranks ranks={ranks} />

			<div className={styles.tiles}>
				{ranks.map((rank, i) =>
					files.map((file, j) => (
						<span
							key={file + "" + rank}
							data-i={i}
							data-j={j}
							className={`
							${styles[`${getClassName(7 - i, j)}`]} 
							${
								styles[`${getExtendedClassName(7 - i, j)}`]
									? styles[`${getExtendedClassName(7 - i, j)}`]
									: ""
							}
							`}
						></span>
					))
				)}
			</div>

			<Pieces />

			<Popup />

			<Files files={files} />
		</div>
	);
}

export default Board;
