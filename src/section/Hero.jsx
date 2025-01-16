import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import SelectMenu from '../components/SelectMenu';

const Hero = () => {
  const SQUARE = 20;
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

  const GRID = Array.from({ length: SQUARE }, () => new Array(SQUARE).fill(''));

  const isSnakeBody = (xc, yc) => {
    return snakeBody.some(([x, y]) => {
      return x === xc && y === yc;
    });
  };

  const placeFood = () => {
    const places = document.querySelectorAll('.blank');
    const foodLocDOM = places[Math.round(Math.random() * places.length)];
    foodLocDOM && foodLocDOM.classList.replace('blank', 'food');
    return foodLocDOM.id.split(',').map((prev) => parseInt(prev));
  };

  const isSnakeHead = (xc, yc) => {
    return xc === snakeBody[0][0] && yc === snakeBody[0][1];
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
        nx > SQUARE - 1 ||
        ny > SQUARE - 1 ||
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
  };;

  const gameStarted = () => {
    runningStatus.current = true;
    console.log(handleChange)
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
    } else if (keyCode === 'KeyS') {
      if (initConfig.current.x === 0 || initConfig.current.y === 1) {
        return;
      }
      initConfig.current.y = 1;
      initConfig.current.x = 0;
    } else if (keyCode === 'KeyW') {
      if (initConfig.current.x === 0 || initConfig.current.y === 1) {
        return;
      }

      initConfig.current.y = -1;
      initConfig.current.x = 0;
    } else if (keyCode === 'KeyA') {
      if (initConfig.current.x === 1 || initConfig.current.y === 0) {
        return;
      }

      initConfig.current.x = -1;
      initConfig.current.y = 0;
    } else if (keyCode === 'KeyD') {
      if (initConfig.current.x === 1 || initConfig.current.y === 0) {
        return;
      }
      initConfig.current.x = 1;
      initConfig.current.y = 0;
    }
  };

  useEffect(() => {
    autostart && gameStarted();
    document.addEventListener('keydown', (e) => handleUserInput(e.code));
  }, []);

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

  const gameModes = [
    {
      id: '1',
      name: 'Easy',
    },
    {
      id: '2',
      name: 'Medium',
    },
    {
      id: '3',
      name: 'Expert',
    },
  ];

  const handleModeSwitch = ({ id, name }) => {
    console.log(SPEED.current);
    if (id == 1) {
      SPEED.current = 200;
    }
    if (id == 2) {
      SPEED.current = 100;
    }
    if (id == 3) {
      SPEED.current = 50;
    }
  };

  return (
    <section className=" h-dvh w-full bg-slate-200 dark:bg-black dark:text-white flex flex-col justify-center items-center">
      {/* <div className=" my-4 border-b border-gray-400 px-10 mr-48">
        <p className=" text-xl font-medium opacity-80">Snake Game</p>
      </div> */}
      <div className="relative dark:bg-slate-700 bg-white h-96 w-96 rounded-lg grid grid-cols-[repeat(20,_1fr)] shadow-2xl">
        {GRID.map((row, yc) => {
          return row.map((cell, xc) => {
            return (
              <div
                key={`${xc}${yc}`}
                id={`${xc},${yc}`}
                className={
                  isSnakeBody(xc, yc)
                    ? isSnakeHead(xc, yc)
                      ? ' snake head'
                      : 'snake'
                    : ' blank'
                }
              ></div>
            );
          });
        })}
        <div className={`absolute -top-20 bg-white dark:bg-gray-800 p-2 w-full text-center rounded-lg flex justify-between `}>
          <div
            className={` flex gap-5 justify-end items-end ${runningStatus.current && 'pointer-events-none'}`}
          >
            <SelectMenu
              title={'Medium'}
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
      <Button clickedOn={handleClick} />
    </section>
  );
};

export default Hero;
