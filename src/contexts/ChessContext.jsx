import { createContext, useReducer } from "react";
import { useContext } from "react";
import { createPosition } from "../utils";

const ChessContext = createContext();

const initialState = {
	position: [createPosition()],
	turn: "w",
	candidateMoves: [],
};

function reducer(state, action) {
	switch (action.type) {
		case "piece/moved":
			return {
				...state,
				position: [...state.position, action.payload],
				turn: state.turn === "w" ? "b" : "w",
			};
		case "candidateMoves/generate":
			return { ...state, candidateMoves: action.payload };
		case "candidateMoves/clear":
			return { ...state, candidateMoves: [] };
	}
}

function ChessProvider({ children }) {
	const [{ position, turn, candidateMoves }, dispatch] = useReducer(
		reducer,
		initialState
	);

	return (
		<ChessContext.Provider value={{ position, dispatch, turn, candidateMoves }}>
			{children}
		</ChessContext.Provider>
	);
}

function useChess() {
	const context = useContext(ChessContext);
	if (context === undefined)
		throw new Error("useChess must be used within a ChessProvider");
	return context;
}

export { ChessProvider, useChess };
