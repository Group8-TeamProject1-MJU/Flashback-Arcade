import React, { Component, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Snake } from 'react-snake-lib';

const KEY_BIND = {
  LEFT: {
    code: 37,
    name: 'ArrowLeft'
  },
  UP: {
    code: 38,
    name: 'ArrowUp'
  },
  RIGHT: {
    code: 39,
    name: 'ArrowRight'
  },
  DOWN: {
    code: 40,
    name: 'ArrowDown'
  },
};

export default function SnakeGame() {
  const [score, setScore] = useState(-1);

  const handleButtonClick = (keyBind) => {
    const event = new KeyboardEvent('keydown', {
      key: keyBind.name,
      keyCode: keyBind.code,
      which: keyBind.code,
    });

    document.dispatchEvent(event);
  };

  return (
    <>
      <h1>
        SNAKE GAME 🪱
        {score !== undefined ? (
          <p>
            점수: {score}
          </p>
        ) : null
        }
      </h1>

      <Container className='p-0 d-flex justify-content-center'>
        <Snake
          onScoreChange={onScoreChange}
          onGameOver={onGameOver}
          onGameStart={onGameStart}
          boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          size={16}
          bgColor="silver"
          innerBorderColor="#b1b0b0"
          startButtonStyle={{
            color: "white",
            padding: "6px 20px",
            backgroundColor: "#1a1a1a",
            borderRadius: "10px",
            fontSize: "17px",
            fontWeight: "600",
            cursor: "pointer"
          }}
          startButtonHoverStyle={{
            backgroundColor: "#4f4d4d"
          }}
          startGameText="Start Game"
          class="border-black border"
        />
      </Container>

      <Container className="text-center mt-3">
        <Row>
          <Col>
            <Button className="btn-primary" onClick="handleButtonClick(KEY_BIND.UP)">↑</Button>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col className='col-1'>
            <Button className="btn-primary" onClick="handleButtonClick(KEY_BIND.LEFT)">←</Button>
          </Col>
          <Col className='col-1'>
            <Button className="btn-primary" onClick="handleButtonClick(KEY_BIND.RIGHT)">→</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="btn-primary" onClick="handleButtonClick(KEY_BIND.DOWN)">↓</Button>
          </Col>
        </Row>
      </Container>

      <Container className='text-center p-0'>
        <p>🔥게임 이용 방법</p>
        <p>W or ↑ = 위</p>
        <p>A or ← = 좌</p>
        <p>D or → = 우</p>
        <p>S or ↓ = 아래</p>
        <p>모바일은 터치 컨트롤러</p>
      </Container>
    </>
  );

  function onScoreChange() {
    setScore(() => score + 1);
  }

  function onGameOver() {
  }

  function onGameStart() {
    setScore(0);
  }
}
