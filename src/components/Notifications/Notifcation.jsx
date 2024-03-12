import { useChess } from "../../contexts/ChessContext";
import styles from "./Notifcation.module.css";
import PromotionBox from "./PromotionBox/PromotionBox";

export default function Notification() {
	const { status } = useChess();

	if (status === "ongoing") return null;

	return (
		<div className={styles.notification}>
			{status === "promoting" && <PromotionBox />}
		</div>
	);
}
