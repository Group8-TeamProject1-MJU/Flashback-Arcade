import React, { Component } from 'react';
import './style.css';
import { GameRankersContext } from '../../../contexts/GameRankersContext';

class BokseupResponseCheck extends Component {
  static contextType = GameRankersContext;

  constructor(props) {
    super(props);
    this.state = {
      message: 'Click to start',
      bgColorState: 'waiting',
      result: 0,
    };
  }

  timer;
  startTime;
  endTime;

  onClickScreen = () => {
    const { bgColorState } = this.state;

    if (bgColorState === 'waiting') {
      this.setState({
        message: 'Click when screen turns green',
        bgColorState: 'ready',
      });

      this.timer = setTimeout(() => {
        this.startTime = new Date(); // 시간초 세기 시작

        this.setState({
          message: 'Click Now!',
          bgColorState: 'now',
        });
      }, Math.floor(Math.random() * 1000) + 2000);
    } else if (bgColorState === 'ready') {
      // 빨간색 화면일 때 누르면
      this.setState({
        message: 'You clicked too fast',
        bgColorState: 'waiting',
        result: [],
      });
      clearTimeout(this.timer);
    } else if (bgColorState === 'now') {
      console.log('Click when it turns green');
      // 초록색 화면으로 바뀌었을 때
      this.endTime = new Date();

      const result =  this.endTime - this.startTime;
      const { sendScore } = this.context;
      sendScore(result);
      this.setState((prevState) => {
        return { message: 'Click to start', bgColorState: 'waiting', result: result };
      });
    }
  };

  render() {
    const { bgColorState, message, result } = this.state;

    return (
      <>
        <div id="screen" className={bgColorState} onClick={this.onClickScreen}>
          {message}
        </div>
        {result.length === 0 ? null : <div className="score"> Response time: {this.state.result} ms.</div>}
      </>
    );
  }
}

export default BokseupResponseCheck;
