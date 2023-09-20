import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { MdMusicOff, MdMusicNote } from "react-icons/md";
import music1 from "../assets/sounds/music1.mp3";

export default function MusicButton() {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioref = useRef();

  useEffect(() => {
    if (isPlaying) {
      audioref.current.play();
    } else {
      audioref.current.pause();
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioref} loop>
        <source src={music1} type="audio/mp3" />
      </audio>
      <Wrapper2>
        <div className="music-button" onClick={toggleMusic}>
          {isPlaying ? <MdMusicNote /> : <MdMusicOff />}
        </div>
      </Wrapper2>
    </>
  );
}

const Wrapper2 = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .music-button {
    font-size: 2.4rem;
    width: 4rem;
    height: 4rem;
    color: #fff;
    background:linear-gradient(to left,#5252ff,#ff5959,#850085);
    box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 15px 5px;
    border-radius: 50%;
    position: fixed;
    bottom: 3rem;
    left: 2.0rem;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #d6d600;


    &:hover::before {
      position: absolute;
      top: -5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.6rem;
      color: #b3e59f;
    }
  }
  .music-button:hover{
    opacity:80%;
    box-shadow:2px 3px 4px grey;
  }

  @media (max-width: 768px) {
    .music-button {
      bottom: 2rem;
      left: 2rem;
    }
  }
  `;
