import React, { useContext, useEffect, useRef } from "react";
import "./BrickBreakout.css";
import { BallMovement } from "./BallMovement";
import data from "./BBdata";
import WallCollision from "./util/WallCollision";
import Paddle from "./Paddle";
import Brick from "./Brick";
import BrickCollision from "./util/BrickCollision";
import PaddleHit from "./util/PaddleHit";
import PlayerStats from "./PlayerStats";
import AllBroke from "./util/AllBroke";
import ResetBall from "./util/ResetBall";
import { GameRankersContext } from "../../../contexts/GameRankersContext";

let bricks = [];
let { ballObj, paddleProps, brickObj, player } = data;
export default function Board() {
  const canvasRef = useRef(null);
  const { sendScore } = useContext(GameRankersContext);


  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      paddleProps.y = canvas.height - 30;

      // Assign Bricks
      let newBrickSet = Brick(player.level, bricks, canvas, brickObj);

      if (newBrickSet && newBrickSet.length > 0) {
        bricks = newBrickSet;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      PlayerStats(ctx, player, canvas);

      // Display Bricks
      bricks.map((brick) => {
        return brick.draw(ctx);
      });

      // Handle Ball Movement
      BallMovement(ctx, ballObj);

      // Check all broken
      AllBroke(bricks, player, canvas, ballObj);

      if (player.lives === 0) {
        alert("Game Over! Press ok to restart");
        sendScore(player.score);

        player.lives = 5;
        player.level = 1;
        player.score = 0;
        ResetBall(ballObj, canvas, paddleProps);
        paddleProps.y = canvas.height - 30;

        bricks.length = 0;
      }
      // Ball and Wall Collision
      WallCollision(ballObj, canvas, player, paddleProps);

      // Brick Collision
      let brickCollision;

      for (let i = 0; i < bricks.length; i++) {
        brickCollision = BrickCollision(ballObj, bricks[i]);

        if (brickCollision.hit && !bricks[i].broke) {
          if (brickCollision.axis === "X") {
            ballObj.dx *= -1;
            bricks[i].broke = true;
          } else if (brickCollision.axis === "Y") {
            ballObj.dy *= -1;
            bricks[i].broke = true;
          }
          player.score += 10;
        }
      }
      Paddle(ctx, canvas, paddleProps);

      // Paddle + Ball Collision
      PaddleHit(ballObj, paddleProps);

      requestAnimationFrame(render);
    };
    render();
  }, []);

  return (
    <div>
      {/* <h1 className="gameHeader">Breakout Game</h1> */}
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseMove={(event) =>
          (paddleProps.x =
            event.clientX -
            (window.innerWidth < 900 ? 10 : (window.innerWidth * 20) / 200) -
            paddleProps.width / 2 -
            10)
        }
        height="500"
        width={
          window.innerWidth < 1364
            ? window.innerWidth - 20
            : 1344
        }
      />
      <h3 className="note">NOTE: Move your mouse to move the paddle</h3>
      <h3 className="note">Refresh page to start from the beginning</h3>
    </div>
  );
}
