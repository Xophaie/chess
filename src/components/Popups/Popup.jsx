import { useChess } from "../../contexts/ChessContext";
import styles from "./Popup.module.css";
import PromotionBox from "./PromotionBox/PromotionBox";

function Popup() {
	const { status } = useChess();

	if (status === "ongoing") return null;

	return (
		<div className={styles.popup}>
			{status === "promoting" && <PromotionBox />}
		</div>
	);
}

export default Popup;
