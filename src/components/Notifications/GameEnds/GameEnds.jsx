import { useChess } from "../../../contexts/ChessContext";
import styles from "./GameEnds.module.css";

function GameEnds() {
	const { status, message, dispatch } = useChess();
	let ending = status.endsWith("won") ? "wins" : "draws";

	if (status === "ongoing" || status === "promoting") return null;

	function newGame() {
		dispatch({ type: "game/reset" });
	}

	return (
		<div className={`${styles.inner} ${styles["inner--center"]}`}>
			<h1>{status.endsWith("won") ? message : "Draw"}</h1>
			<p>{status === "stalemate" && message}</p>
			<p>{status === "insufficient-material" && message}</p>
			<div
				className={`${styles[ending]} ${
					styles[status.startsWith("w") ? "white" : "black"]
				}`}
			></div>
			<button onClick={newGame}>New Game</button>
		</div>
	);
}

export default GameEnds;
