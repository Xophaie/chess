import styles from "./Takeback.module.css";
import { useChess } from "../../contexts/ChessContext";

function Takeback() {
	const { dispatch, position } = useChess();

	function handleTakeBack() {
		if (position.length > 1) dispatch({ type: "game/takeback" });
	}

	return (
		<button className={styles.takeback} onClick={() => handleTakeBack()}>
			Take Back
		</button>
	);
}

export default Takeback;
