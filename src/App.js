import React, { useReducer, useEffect } from "react";
import "./styles.css";
import Paddle from "./components/Paddle";
import Ball from "./components/Ball";
import { level_one } from "./levels";
import Obstacle from "./components/Obstacle";
import willCollide from "./utils/willCollide";

import GameProvider from "./state/context";

const obstacles = level_one.reduce((acc, cur, y) => {
  const blocks = cur.split("").reduce((bs, b, x) => {
    if (b === " ") {
      return [...bs];
    }
    return [
      ...bs,
      {
        type: b,
        x: x * 10,
        y: y * 10,
        width: 10,
        height: 10
      }
    ];
  }, []);
  return [...acc, ...blocks];
}, []);

console.log("OBSTACLES", obstacles);

const initialState = {
  paddle1: {
    y: 0,
    dy: 0
  },
  paddle2: {
    y: 0,
    dy: 0
  },
  ball: {
    x: 150,
    y: 150,
    dx: 5,
    dy: 5
  },
  obstacles

  // [
  //   {
  //     y: 10,
  //     x: 190,
  //     width: 20,
  //     height: 20
  //   },
  //   {
  //     y: 98,
  //     x: 190,
  //     width: 20,
  //     height: 100
  //   },
  //   {
  //     y: 260,
  //     x: 190,
  //     width: 20,
  //     height: 20
  //   }
  // ]
};

function reducer(state, action) {
  switch (action.type) {
    case "MOVE_PADDLE_1":
      return {
        ...state,
        paddle1: {
          ...state.paddle1,
          ...action.payload
        }
      };
    case "MOVE_PADDLE_2":
      return {
        ...state,
        paddle2: {
          ...state.paddle2,
          ...action.payload
        }
      };
    case "RENDER":
      return {
        ...state,
        ball: { ...state.ball, ...action.payload.ball },
        paddle1: { ...state.paddle1, ...action.payload.paddle1 },
        paddle2: { ...state.paddle2, ...action.payload.paddle2 }
      };
    default:
      throw new Error("Event not found: ", action.type);
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleKeyDown(e) {
    const char = e.key.toLowerCase();
    if (char === "w" && state.paddle1.dy !== -10) {
      dispatch({
        type: "MOVE_PADDLE_1",
        payload: {
          dy: -10
        }
      });
    }
    if (char === "s" && state.paddle1.dy !== 10) {
      dispatch({
        type: "MOVE_PADDLE_1",
        payload: {
          dy: 10
        }
      });
    }
    if (char === "o" && state.paddle2.dy !== -10) {
      dispatch({
        type: "MOVE_PADDLE_2",
        payload: {
          dy: -10
        }
      });
    }
    if (char === "l" && state.paddle2.dy !== 10) {
      dispatch({
        type: "MOVE_PADDLE_2",
        payload: {
          dy: 10
        }
      });
    }
  }
  function handleKeyUp(e) {
    const char = e.key.toLowerCase();
    if (char === "w" || char === "s") {
      dispatch({
        type: "MOVE_PADDLE_1",
        payload: {
          dy: 0
        }
      });
    }
    if (char === "o" || char === "l") {
      dispatch({
        type: "MOVE_PADDLE_2",
        payload: {
          dy: 0
        }
      });
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state]);
  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [state]);

  useEffect(() => {
    const handle = setTimeout(() => {
      let x = state.ball.x;
      let y = state.ball.y;

      let dx = state.ball.dx;
      let dy = state.ball.dy;

      let p1y = state.paddle1.y;
      let p2y = state.paddle2.y;

      let p1dy = state.paddle1.dy;
      let p2dy = state.paddle2.dy;

      const walls = [
        // left
        {
          x: -100,
          y: 0,
          width: 100,
          height: 300
        },
        // right
        {
          x: 400,
          y: 0,
          width: 100,
          height: 300
        },
        // top
        {
          x: 0,
          y: -100,
          width: 400,
          height: 100
        },
        // bottom
        {
          x: 0,
          y: 300,
          width: 400,
          height: 100
        }
      ];

      const ball = {
        x,
        dx,
        y,
        dy,
        width: 20,
        height: 20
      };

      const collisions = [
        ...walls,
        ...state.obstacles,
        {
          ...state.paddle1,
          x: 20,
          height: 100,
          width: 25
        },
        {
          ...state.paddle2,
          x: 355,
          height: 100,
          width: 25
        }
      ].map(ob => {
        return willCollide(ball, ob);
      });

      if (collisions.some(c => c.x)) {
        dx = -dx;
      }

      if (collisions.some(c => c.y)) {
        dy = -dy;
      }

      if (p1y + state.paddle1.dy > 300 - 100) {
        p1y = 200;
      } else if (p1y + state.paddle1.dy < 0) {
        p1y = 0;
      } else {
        p1y = p1y + p1dy;
      }

      if (p2y + state.paddle2.dy > 300 - 100) {
        p2y = 200;
      } else if (p2y + state.paddle2.dy < 0) {
        p2y = 0;
      } else {
        p2y = p2y + p2dy;
      }

      dispatch({
        type: "RENDER",
        payload: {
          ball: {
            dx,
            dy,
            x: x + dx,
            y: y + dy
          },
          paddle1: {
            y: p1y,
            dy: p1dy
          },
          paddle2: {
            y: p2y,
            dy: p2dy
          }
        }
      });
    }, 50);
    return () => clearTimeout(handle);
  }, [
    state.ball,
    state.paddle1.y,
    state.paddle1.dy,
    state.paddle2.y,
    state.paddle2.dy
  ]);

  return (
    <GameProvider>
      <div className="container">
        {state.obstacles.map(({ type, ...style }) => (
          <Obstacle type={type} style={style} />
        ))}
        <Paddle paddleY={state.paddle1.y} />
        <Paddle isPlayerTwo paddleY={state.paddle2.y} />
        <Ball pos={state.ball} />
      </div>
    </GameProvider>
  );
}
