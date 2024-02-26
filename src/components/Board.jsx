import styles from "./Board.module.css";

function Board() {
	const ranks = Array(8)
		.fill("")
		.map((_, i) => 8 - i);

	const files = Array(8)
		.fill("")
		.map((_, j) => String.fromCharCode(96 + (j + 1)));

	console.log(ranks, files);

	return (
		<div className={styles.board}>
			<div className={styles.ranks}>a</div>
			<div className={styles.tiles}>
				{ranks.map((_, i) =>
					files.map((_, j) => <div className={styles.tile} key={i + j} />)
				)}
			</div>
			<div className={styles.files}>c</div>
		</div>
	);
}

export default Board;
