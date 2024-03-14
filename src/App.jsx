import styles from "./App.module.css";
import Board from "./components/Board/Board";
import Control from "./components/Control/Control";
import Notations from "./components/Control/Notations";
import Takeback from "./components/Control/Takeback";

function App() {
	return (
		<div className={styles.app}>
			<Board />
			<Control>
				<Notations />
				<Takeback />
			</Control>
		</div>
	);
}

export default App;
