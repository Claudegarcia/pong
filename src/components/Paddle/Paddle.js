import React from "react";
import "./Paddle.css";

export default function Paddle({ isPlayerTwo, paddleY }) {
  return (
    <div
      className={isPlayerTwo ? "paddle player2" : "paddle"}
      style={{ top: `${paddleY}px` }}
    />
  );
}
