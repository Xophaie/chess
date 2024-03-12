import arbiter from "../../arbiter/arbiter";
import { getKingPosition } from "../../arbiter/getMoves";
import { useChess } from "../../contexts/ChessContext";
import Notification from "../Notifications/Notifcation";
import Pieces from "../Pieces/Pieces";
import styles from "./Board.module.css";
import Files from "./Files";
import Ranks from "./Ranks";

function Board() {
	let { position, candidateMoves, turn, positions, castlingDirection } =
		useChess();
	position = position[position.length - 1];

	const ranks = Array(8)
		.fill("")
		.map((_, i) => 8 - i);

	const files = Array(8)
		.fill("")
		.map((_, j) => String.fromCharCode(96 + (j + 1)));

	const isPlayerChecked = (() => {
		if (
			arbiter.isChecked({
				positionAfterMove: position,
				player: turn,
				position,
				positions,
				castlingDirection,
			})
		) {
			console.log(
				getKingPosition({ positionAfterMove: position, player: turn })
			);
			return getKingPosition({ positionAfterMove: position, player: turn });
		}

		return null;
	})();
	function getClassName(i, j) {
		let c = [];

		if ((i + j) % 2 === 0) c.push("tile--dark");
		else c.push("tile--light");

		if (candidateMoves?.find(coord => coord[0] === i && coord[1] === j)) {
			if (position[i][j]) {
				c.push("attacking");
			} else {
				c.push("highlight");
			}
		}

		if (
			isPlayerChecked &&
			isPlayerChecked[0] === i &&
			isPlayerChecked[1] === j
		) {
			c.push("checked");
		}

		return c;
	}

	const classLister =
		styleObject =>
		(...classList) =>
			classList.reduce((list, myClass) => {
				let output = list;
				if (styleObject[myClass]) {
					if (list) output += " ";
					output += styleObject[myClass];
				}
				return output;
			}, "");

	const classes = classLister(styles);

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
							className={classes(...getClassName(7 - i, j))}
						></span>
					))
				)}
			</div>

			<Pieces />

			<Notification />

			<Files files={files} />
		</div>
	);
}

export default Board;
