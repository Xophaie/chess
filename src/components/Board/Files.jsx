import styles from "./Files.module.css";

function Files({ files }) {
	return (
		<div className={styles.files}>
			{files.map(rank => (
				<span key={rank}>{rank}</span>
			))}
		</div>
	);
}

export default Files;
