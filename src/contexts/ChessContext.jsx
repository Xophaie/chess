import { createContext, useReducer } from "react";
import { useContext } from "react";
import { createPosition } from "../utils";

const ChessContext = createContext();

const initialState = {
	position: [createPosition()],
	turn: "w",
	candidateMoves: [],
	status: "ongoing",
	promotionSquare: null,
	castlingDirection: {
		w: "both",
		b: "both",
	},
	message: null,
	movesList: [],
};

function reducer(state, action) {
	switch (action.type) {
		case "piece/moved":
			return {
				...state,
				position: [...state.position, action.payload.newPosition],
				turn: state.turn === "w" ? "b" : "w",
				movesList: [...state.movesList, action.payload.newMove],
			};
		case "piece/promoting":
			return {
				...state,
				status: "promoting",
				promotionSquare: { ...action.payload },
			};
		case "piece/promoted":
			return {
				...state,
				status: "ongoing",
				promotionSquare: null,
			};

		case "candidateMoves/generate":
			return { ...state, candidateMoves: action.payload };
		case "candidateMoves/clear":
			return { ...state, candidateMoves: [] };
		case "game/stalemate":
			return {
				...state,
				status: "stalemate",
				message: "Game ends due to stalemate",
			};
		case "game/insufficient-material":
			return {
				...state,
				status: "insufficient-material",
				message: "Game ends due to insufficient material",
			};
		case "game/white-won":
			return { ...state, status: "white-won", message: "White won" };
		case "game/black-won":
			return { ...state, status: "black-won", message: "Black won" };
		case "game/reset":
			return { ...initialState };
		case "game/takeback":
			return {
				...state,
				turn: state.turn === "w" ? "b" : "w",
				position: state.position.slice(0, -1),
				movesList: state.movesList.slice(0, -1),
			};
	}
}

function ChessProvider({ children }) {
	const [
		{
			position,
			turn,
			candidateMoves,
			status,
			promotionSquare,
			castlingDirection,
			message,
			movesList,
		},
		dispatch,
	] = useReducer(reducer, initialState);

	return (
		<ChessContext.Provider
			value={{
				position,
				dispatch,
				turn,
				candidateMoves,
				status,
				promotionSquare,
				castlingDirection,
				message,
				movesList,
			}}
		>
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
