import React from "react";

export const GameContext = React.createContext();

export default function GameProvider(props) {
  return <GameContext.Provider value={{}} {...props} />;
}
