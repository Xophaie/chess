import styles from "./Control.module.css";

function Control({ children }) {
	return <div className={styles.control}>{children}</div>;
}

export default Control;
