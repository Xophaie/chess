import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChessProvider } from "./contexts/ChessContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ChessProvider>
			<App />
		</ChessProvider>
	</React.StrictMode>
);
