import React, { Component } from 'react';
import './style.css';

class BokseupResponseCheck extends Component {
constructor(props) {
super(props);
this.state = {
  message: '클릭해서 시작하기',
  bgColorState: 'waiting',
  result: [],
};
}

timer;
startTime;
endTime;

onClickScreen = () => {
const { bgColorState } = this.state;

if (bgColorState === 'waiting') {
  this.setState({
    message: '초록색으로 바뀌면 클릭',
    bgColorState: 'ready',
  });

  this.timer = setTimeout(() => {
    this.startTime = new Date(); // 시간초 세기 시작

    this.setState({
      message: '지금 클릭!',
      bgColorState: 'now',
    });
  }, Math.floor(Math.random() * 1000) + 2000);
} else if (bgColorState === 'ready') {
  // 빨간색 화면일 때 누르면
  this.setState({
    message: '너무 빨리 눌렀음',
    bgColorState: 'waiting',
    result: [],
  });
  clearTimeout(this.timer);
} else if (bgColorState === 'now') {
  console.log('초록색 일때 클릭');
  // 초록색 화면으로 바뀌었을 때
  this.endTime = new Date();

  this.setState((prevState) => {
    return { message: '클릭해서 시작하기', bgColorState: 'waiting', result: [...prevState.result, this.endTime - this.startTime] };
  });
}
};

// 결과값 평균 계산
resultAverage = () => {
const { result } = this.state;
const average = result.reduce((acc, currentValue) => acc + currentValue) / result.length;

return average;
};

render() {
const { bgColorState, message, result } = this.state;

return (
  <>
    <div id="screen" className={bgColorState} onClick={this.onClickScreen}>
      {message}
    </div>
    {result.length === 0 ? null : <div> 반응 시간 평균 {this.resultAverage()} ms 걸렸어요.</div>}
  </>
);
}
}

export default BokseupResponseCheck;
