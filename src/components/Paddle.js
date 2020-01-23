import React from "react";
import "./Paddle.css";

function Paddle({ isPlayerTwo, isPlayerOne }) {
  return (
    <div
      className={
        isPlayerOne
          ? "paddle player1"
          : isPlayerTwo
          ? "paddle player2"
          : "paddle"
      }
    />
  );
}
export default Paddle;
