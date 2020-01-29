import React from "react";
import "./Ball.css";

export default function Ball({ pos }) {
  return (
    <div
      className="ball"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }}
    />
  );
}
