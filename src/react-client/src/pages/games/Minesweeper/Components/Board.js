import React, { useState, useEffect, useContext } from 'react';
import CreateBoard from '../Utils/CreateBoard';
import { revealed } from "../Utils/Reveal";
import Cell from './Cell';
import { GameRankersContext } from '../../../../contexts/GameRankersContext';

function Board() {
  const [grid, setGrid] = useState([]);
  const [nonMinecount, setNonMinecount] = useState(0);
  const [mineLocation, setmineLocation] = useState([]);
  const [timer, setTimer] = useState(0); // 타이머 상태 추가
  const [isGameActive, setIsGameActive] = useState(false); // 게임 상태 추가

  const { sendScore } = useContext(GameRankersContext);

  const style = {
    display: 'flex',
    flexDirection: 'row',
    width: 'fit-content',
    color: 'white',
  }

  useEffect(() => {
    newfresh();
  }, []);

  useEffect(() => {
    if (isGameActive) {
      const interval = setInterval(() => {
        setTimer(timer + 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [timer, isGameActive]);

  const freshBoard = () => {
    const newBoard = CreateBoard(10, 10, 20);
    setNonMinecount(10 * 10 - 20);

    setmineLocation(newBoard.mineLocation);
    setGrid(newBoard.board);
  }

  const updateFlag = (e, x, y) => {
    e.preventDefault();

    let newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[x][y].flagged = true;
    console.log(newGrid[x][y]);
    setGrid(newGrid);
  }

  const newfresh = () => {
    setIsGameActive(true);
    setTimer(0);
    freshBoard();
  }

  const revealcell = (x, y) => {
    let newGrid = JSON.parse(JSON.stringify(grid));
    if (newGrid[x][y].value === "X") {
      alert(' Clicked on Mine ,Try Again');
      for (let i = 0; i < mineLocation.length; i++) {
        newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true;
      }
      setGrid(newGrid);
      console.log(timer);
      setTimeout(newfresh, 500);
    }
    if (nonMinecount === 0) {
      // eslint-disable-next-line
      alert('Wohoo!!,You won');
      sendScore(timer);
      setTimeout(newfresh, 500);
    }
    else {
      let revealedboard = revealed(newGrid, x, y, nonMinecount);
      setGrid(revealedboard.arr);
      setNonMinecount(revealedboard.newNonMines);
    }

  }
  return (
    <div className="parent">

      <div style={{ color: "white", textAlign: "center", fontSize: "35px" }}>Non-Mines : {nonMinecount}</div>
      <div>
        {/* <ToastContainer></ToastContainer> */}
        {grid.map((singlerow, index1) => {
          return (

            <div style={style} key={index1}>
              {singlerow.map((singlecol, index2) => {
                return <Cell details={singlecol} key={index2} updateFlag={updateFlag} revealcell={revealcell} />
              })}
            </div>

          )
        })}
      </div>

    </div>
  )

}
export default Board;

