import arbiter from "../../../arbiter/arbiter";
import { useChess } from "../../../contexts/ChessContext";
import { copyPosition, getNewMoveNotation, playSound } from "../../../utils";
import styles from "./PromotionBox.module.css";

function PromotionBox() {
	const options = ["q", "r", "b", "n"];
	const { promotionSquare, position, dispatch, castlingDirection, positions } =
		useChess();

	const color = promotionSquare.x === 7 ? "w" : "b";
	const enemy = color === "w" ? "b" : "w";

	function onClick(option) {
		const newPosition = copyPosition(position[position.length - 1]);

		newPosition[promotionSquare.rank][promotionSquare.file] = "";
		newPosition[promotionSquare.x][promotionSquare.y] = color + option;

		const newMove = getNewMoveNotation({
			p: color + "p",
			...promotionSquare,
			position,
			promotesTo: option,
		});

		if (position[Number(promotionSquare.x)][Number(promotionSquare.y)]) {
			playSound("capture");
		} else {
			playSound("move");
		}

		dispatch({ type: "piece/moved", payload: { newPosition, newMove } });
		dispatch({ type: "piece/promoted" });

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
			enemy === "b"
				? dispatch({ type: "game/white-won" })
				: dispatch({ type: "game/black-won" });
		}

		dispatch({ type: "candidateMoves/clear" });
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
