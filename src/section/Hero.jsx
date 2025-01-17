import React, { useEffect, useRef, useState } from 'react';
import Button, { btnSize, btnStyle } from '../components/Button';
import SelectMenu from '../components/SelectMenu';
import SingleBtn from '../components/SingleBtn';
import { CgPlayButton } from 'react-icons/cg';
import { BiReset } from 'react-icons/bi';
import Area from '../components/Area';

const controls = [
  { id: 0, name: 'External' },
  { id: 1, name: 'V-Keys' },
  { id: 2, name: 'Touch' },
];

const gameModes = [
  { id: 0, name: 'Easy' },
  { id: 1, name: 'Medium' },
  { id: 2, name: 'Expert' },
];
let touchMoveHandler, touchStartHandler, touchEndHandler, keyDownHandler;
export const SQUARE = 20;

const Hero = () => {
  const SPEED = useRef(100);
  const autostart = false;
  const runningStatus = useRef(false);
  let interval;
  let foodLoc;
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

  const placeFood = () => {
    const places = document.querySelectorAll('.blank');
    const foodLocDOM = places[Math.round(Math.random() * places.length)];
    foodLocDOM && foodLocDOM.classList.replace('blank', 'food');
    return foodLocDOM.id.split(',').map((prev) => parseInt(prev));
  };

  const gameOver = () => {
    setSnakeBody(initConfig.current.pos);
    initConfig.current.x = 1;
    initConfig.current.y = 0;
    clearInterval(interval);
    checkHighScore();
    document.querySelector('.food').classList.replace('food', 'blank');
    runningStatus.current = false;
    autostart && gameStarted();
  };

  const checkHighScore = () => {
    if (highScore.current < pointCount.current) {
      highScore.current = pointCount.current;
      localStorage.setItem('highScore', pointCount.current);
    }
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

      const copySnakeBody = prevBody.map((arr) => [...arr]);

      if (foodLoc) {
        if (foodLoc[0] === nx && foodLoc[1] === ny) {
          copySnakeBody.push(foodLoc);
          pointCount.current = pointCount.current + 1;
          foodLoc = placeFood();
        }
      }

      copySnakeBody.pop();
      copySnakeBody.unshift(newHead);
      return copySnakeBody;
    });
  };

  const gameStarted = () => {
    runningStatus.current = true;
    interval = setInterval(handleChange, SPEED.current);
    pointCount.current = 0;
    foodLoc = placeFood();
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

        let keyCode = '';

        if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
          return;
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          keyCode = deltaX > 0 ? 'KeyD' : 'KeyA';
        } else {
          keyCode = deltaY > 0 ? 'KeyS' : 'KeyW';
        }
        handleUserInput(keyCode);
      };

      document.addEventListener('touchmove', touchMoveHandler, {
        passive: false,
      });
      document.addEventListener('touchstart', touchStartHandler);
      document.addEventListener('touchend', touchEndHandler);
    } else {
      setControlActive(1);

      keyDownHandler = (e) => handleUserInput(e.code);
      document.addEventListener('keydown', keyDownHandler);
    }
  }, []);

  useEffect(() => {
    if (controlActive === 1) {
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
    console.log('speed changed to : ', SPEED.current);
  };
  const handleControlSwitch = ({ id }) => {
    setControlActive(id);
  };

  return (
    <section className=" select-none h-dvh w-full bg-slate-200 dark:bg-black dark:text-white flex flex-col justify-center items-center">
      <div
        id="canvas"
        className="relative dark:bg-slate-700 bg-white h-96 w-96 rounded-lg grid grid-cols-[repeat(20,_1fr)] shadow-2xl"
      >
        <Area snakeBody={snakeBody} />
        <div
          className={`absolute -top-20 bg-white dark:bg-gray-800 p-2 w-full text-center rounded-lg flex justify-between `}
        >
          <div
            className={` flex gap-5 justify-end items-end ${runningStatus.current && 'pointer-events-none'}`}
          >
            <SelectMenu
              title={gameModes[1].name}
              items={gameModes}
              handleClick={handleModeSwitch}
            />
          </div>
          <div className="">
            <p className=" font-bold">
              High Score : <span>{highScore.current}</span>
            </p>
            <div className=" h-px w-3/4 mx-auto bg-gray-600"></div>
            <p className=" font-medium">{pointCount.current}</p>
          </div>
        </div>
      </div>

      <div className=" flex gap-4 bg-slate-100 dark:bg-slate-900 p-2 rounded-b-lg">
        <SingleBtn
          keyCode={'Enter'}
          label={'Space'}
          logo={
            <CgPlayButton
              size={40}
              className={
                ' text-gray-900 w-32 dark:text-gray-200 pointer-events-none'
              }
            />
          }
          onClick={() => handleClick('Enter')}
        />
        <SingleBtn
          keyCode={'Reset'}
          label={'Reset'}
          onClick={() => location.reload()}
          logo={<BiReset size={btnSize} className={btnStyle + ' p-3 '} />}
        />
      </div>

      {controlActive !== null && (
        <div className=" mt-4 ">
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
              title={controls[controlActive].name}
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
