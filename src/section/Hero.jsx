import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import SelectMenu from '../components/SelectMenu';
import Area from '../components/Area';
import startBtn from '../assets/startBtn.png';
import reset from '../assets/reset.png';
import highScoreImg from '../assets/highScore.png';
import gauge from '../assets/gauge.png';

import energetic from '../assets/speed/energetic.png';
import anaconda from '../assets/speed/anaconda.png';
import snail from '../assets/speed/snail.png';

import keyboard from '../assets/controls/keyboard.png';
import desktop from '../assets/controls/desktop.png';
import touch from '../assets/controls/touch.png';

const controls = [
  { id: 0, name: 'External', img: keyboard },
  { id: 1, name: 'V-Keys', img: desktop },
  { id: 2, name: 'Touch', img: touch },
];

const gameModes = [
  { id: 0, name: 'Easy', img: snail },
  { id: 1, name: 'Medium', img: anaconda },
  { id: 2, name: 'Expert', img: energetic },
];

const powerUpAt = [3, 12, 18, 30, 42, 60, 85];

let touchMoveHandler, touchStartHandler, touchEndHandler, keyDownHandler;
export const SQUARE = 22;

const Hero = () => {
  const SPEED = useRef(100);
  const autostart = false;
  const runningStatus = useRef(false);
  let foodLoc;
  let powerLoc = null;
  let highScore = useRef(localStorage.getItem('highScore') || 0);
  let pointCount = useRef(0);
  const initConfig = useRef({
    x: 1,
    y: 0,
    pos: [
      [3, 3],
      [2, 3],
      [1, 3],
    ],
  });

  const [snakeBody, setSnakeBody] = useState(initConfig.current.pos);
  const [controlActive, setControlActive] = useState(null);

  const placeFood = (type = 'food') => {
    const places = document.querySelectorAll('.blank');
    const foodLocDOM = places[Math.round(Math.random() * places.length)];
    foodLocDOM && foodLocDOM.classList.replace('blank', type);
    return foodLocDOM.id.split('_').map((prev) => parseInt(prev));
  };

  const intervalRef = useRef(null);

  const gameOver = () => {
    setSnakeBody(initConfig.current.pos);
    initConfig.current.x = 1;
    initConfig.current.y = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    checkHighScore();
    runningStatus.current = false;
    try {
      document.querySelector('.food')?.classList.replace('food', 'blank');
      document.querySelector('.food2')?.classList.replace('food2', 'blank');
    } catch (e) {
      console.log('No food spoted for removal', e);
    }
    if (autostart) {
      gameStarted();
    }
  };

  const gameStarted = () => {
    runningStatus.current = true;
    intervalRef.current = setInterval(handleChange, SPEED.current);
    pointCount.current = 0;
    foodLoc = placeFood();
  };

  const checkHighScore = () => {
    if (highScore.current < pointCount.current) {
      highScore.current = pointCount.current;
      localStorage.setItem('highScore', pointCount.current);
    }
  };

  const foodEaten = (copySnakeBody, head_x, head_y) => {
    let timer;
    if (foodLoc) {
      if (foodLoc[0] === head_x && foodLoc[1] === head_y) {
        copySnakeBody.push(foodLoc);
        pointCount.current = pointCount.current + 1;
        foodLoc = placeFood();

        if (powerUpAt.includes(pointCount.current) && powerLoc === null) {
          powerLoc = placeFood('food2');
          timer = setTimeout(() => {
            clearTimeout(timer);
            powerLoc = null;
            document
              .querySelector('.food2')
              ?.classList.replace('food2', 'blank');
          }, 5000);
        }
      }
    }
    if (powerLoc) {
      if (powerLoc[0] === head_x && powerLoc[1] === head_y) {
        pointCount.current = pointCount.current + 3;
        clearTimeout(timer);
        powerLoc = null;
      }
    }
    return copySnakeBody;
  };

  const handleChange = () => {
    setSnakeBody((prevBody) => {
      const nx = prevBody[0][0] + initConfig.current.x;
      const ny = prevBody[0][1] + initConfig.current.y;
      const newHead = [nx, ny];

      if (
        nx >= SQUARE ||
        ny >= SQUARE ||
        nx < 0 ||
        ny < 0 ||
        prevBody.some(([x, y]) => {
          return newHead[0] === x && newHead[1] === y;
        })
      ) {
        gameOver();
      }

      let copySnakeBody = prevBody.map((arr) => [...arr]);
      copySnakeBody = foodEaten(copySnakeBody, nx, ny);

      copySnakeBody.pop();
      copySnakeBody.unshift(newHead);
      return copySnakeBody;
    });
  };

  const handleUserInput = (keyCode) => {
    if (keyCode === 'Enter' || keyCode === 'Space') {
      if (runningStatus.current === false) {
        gameStarted();
        return;
      } else {
        return;
      }
    }

    if (runningStatus.current === false) {
      return;
    }

    if (keyCode === 'KeyS' || keyCode === 'ArrowDown') {
      if (initConfig.current.x === 0 || initConfig.current.y === 1) {
        return;
      }

      initConfig.current.y = 1;
      initConfig.current.x = 0;
    } else if (keyCode === 'KeyW' || keyCode === 'ArrowUp') {
      if (initConfig.current.x === 0 || initConfig.current.y === 1) {
        return;
      }

      initConfig.current.y = -1;
      initConfig.current.x = 0;
    } else if (keyCode === 'KeyA' || keyCode === 'ArrowLeft') {
      if (initConfig.current.x === 1 || initConfig.current.y === 0) {
        return;
      }

      initConfig.current.x = -1;
      initConfig.current.y = 0;
    } else if (keyCode === 'KeyD' || keyCode === 'ArrowRight') {
      if (initConfig.current.x === 1 || initConfig.current.y === 0) {
        return;
      }

      initConfig.current.x = 1;
      initConfig.current.y = 0;
    }
  };

  useEffect(() => {
    autostart && gameStarted();

    const isMobileDevice = () => {
      return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    };

    touchMoveHandler = (e) => {
      if (window.scrollY === 0) {
        e.preventDefault();
      }
    };

    if (isMobileDevice()) {
      setControlActive(2);

      let startX, startY, endX, endY;

      touchStartHandler = (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      };

      touchEndHandler = (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;

        const deltaX = endX - startX;
        const deltaY = endY - startY;
        if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
          return;
        }

        let keyCode = '';
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          keyCode = deltaX > 0 ? 'KeyD' : 'KeyA';
        } else {
          keyCode = deltaY > 0 ? 'KeyS' : 'KeyW';
        }
        handleUserInput(keyCode);
      };
    } else {
      setControlActive(0);
      keyDownHandler = (e) => handleUserInput(e.code);
      document.addEventListener('keydown', keyDownHandler);
    }
  }, []);

  useEffect(() => {
    if (controlActive === null) {
      return;
    }
    if (controlActive === 2) {
      document.addEventListener('touchmove', touchMoveHandler, {
        passive: false,
      });
      document.addEventListener('touchstart', touchStartHandler);
      document.addEventListener('touchend', touchEndHandler);
    }
    if (controlActive !== 2) {
      document.removeEventListener('touchstart', touchStartHandler);
      document.removeEventListener('touchend', touchEndHandler);
    }
  }, [controlActive]);

  const handleClick = (key) => {
    switch (key) {
      case 'KeyW':
      case 'KeyS':
      case 'KeyA':
      case 'KeyD':
      case 'Enter':
        handleUserInput(key);
        break;
      default:
        console.log(key + ' : not handled');
    }
  };

  const handleModeSwitch = ({ id }) => {
    if (id == 0) {
      SPEED.current = 200;
    }
    if (id == 1) {
      SPEED.current = 100;
    }
    if (id == 2) {
      SPEED.current = 50;
    }
  };
  const handleControlSwitch = ({ id }) => {
    setControlActive(id);
  };

  return (
    <section className="snake-container select-none h-dvh w-full bg-slate-200 dark:bg-black dark:text-white flex flex-col justify-center items-center">
      <div
        id="canvas"
        style={{
          height: `${SQUARE * 20}px`,
          width: `${SQUARE * 20}px`,
          gridTemplateColumns: `repeat(${SQUARE}, 1fr)`,
        }}
        className={`relative dark:bg-slate-700 bg-white rounded-lg grid`}
      >
        <Area snakeBody={snakeBody} />
        <div
          className={`menu-container absolute -top-24 bg-white dark:bg-gray-800 p-2 w-full text-center rounded-lg flex justify-between `}
        >
          <div
            className={` flex gap-5 justify-end items-end ${runningStatus.current && 'pointer-events-none'}`}
          >
            <SelectMenu
              activeId={1}
              items={gameModes}
              handleClick={handleModeSwitch}
            />
          </div>
          <div>
            <div className=" flex gap-2 items-end justify-between">
              <img src={highScoreImg} alt="" className="" />
              <p className=" font-bold">
                High Score : <span>{highScore.current}</span>
              </p>
            </div>
            <div className=" h-px mx-auto bg-gray-400"></div>
            <div className=" flex items-center justify-between">
              <img src={gauge} alt="" className="" />
              <p className=" font-medium">{pointCount.current}</p>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex gap-4 dark:bg-slate-900 p-2 rounded-lg">
        <img
          className={` shadow-2xl rounded-xl h-16 active:scale-80 transition-all cursor-pointer ${runningStatus.current && ' opacity-70 scale-90'}`}
          src={startBtn}
          onClick={() => handleClick('Enter')}
          alt=""
        />
        <img
          className=" h-16 active:scale-90 cursor-pointer scale-75 rounded-2xl "
          src={reset}
          onClick={() => location.reload()}
          alt=""
        />
      </div>

      {controlActive !== null && (
        <div className=" control-container mt-4 ">
          {
            {
              0: (
                <p className=" h-[200px] w-1/2 hidden">
                  {controls[controlActive].name}
                </p>
              ),
              1: <Button clickedOn={handleClick} />,
              2: (
                <p className=" w-1/2 hidden">{controls[controlActive].name}</p>
              ),
            }[controlActive]
          }
        </div>
      )}
      {controlActive !== null && (
        <div className=" absolute w-full flex justify-center bottom-0">
          <div className=" flex gap-4 items-center border text-sm border-gray-300 border-b-0 rounded-t-xl bg-gray-100 dark:bg-gray-800 p-2">
            <p>Control Type</p>
            <SelectMenu
              activeId={controlActive}
              items={controls}
              position={'top'}
              handleClick={handleControlSwitch}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
