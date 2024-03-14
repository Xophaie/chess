import { useChess } from "../../contexts/ChessContext";
import styles from "./Notifcation.module.css";

export default function Notification({ children }) {
	const { status } = useChess();

	if (status === "ongoing") return null;

	return <div className={styles.notification}>{children}</div>;
}
