import { useChess } from "../../contexts/ChessContext";
import styles from "./Notations.module.css";

function Notations() {
	const { movesList } = useChess();

	return (
		<div className={styles.notations}>
			{movesList.map((move, i) => (
				<div key={i} data-number={Math.floor(i / 2) + 1}>
					{move}
				</div>
			))}
		</div>
	);
}

export default Notations;
