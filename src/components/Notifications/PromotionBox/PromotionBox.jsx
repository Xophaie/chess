import { useChess } from "../../../contexts/ChessContext";
import { copyPosition } from "../../../utils";
import styles from "./PromotionBox.module.css";

function PromotionBox() {
	const options = ["q", "r", "b", "n"];
	const { promotionSquare, position, dispatch } = useChess();

	const color = promotionSquare.x === 7 ? "w" : "b";

	function onClick(option) {
		const newPosition = copyPosition(position[position.length - 1]);

		newPosition[promotionSquare.rank][promotionSquare.file] = "";
		newPosition[promotionSquare.x][promotionSquare.y] = color + option;

		dispatch({ type: "candidateMoves/clear" });
		dispatch({ type: "piece/moved", payload: newPosition });
		dispatch({ type: "piece/promoted" });
	}

	return (
		<div className={`${styles["inner"]} ${styles["promotion-choices"]}`}>
			{options.map(option => (
				<div
					key={option}
					className={`${styles.piece} ${styles[color + option]}`}
					onClick={() => {
						onClick(option);
					}}
				></div>
			))}
		</div>
	);
}

export default PromotionBox;
