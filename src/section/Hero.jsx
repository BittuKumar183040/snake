import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const SQUARE = 20;
  const SPEED = 100;

  let runningStatus = false;
  let interval;
  let foodLoc;
  let highScore = useRef(123);
  let pointCount = useRef(0);

  const initConfig = {
    x: 1,
    y: 0,
    pos: [
      [3, 3],
      [2, 3],
      [1, 3],
    ],
  };

  const [snakeBody, setSnakeBody] = useState(initConfig.pos);

  const GRID = Array.from({ length: SQUARE }, () => new Array(SQUARE).fill(''));

  const isSnakeBody = (xc, yc) => {
    return snakeBody.some(([x, y]) => {
      return x === xc && y === yc;
    });
  };

  const placeFood = () => {
    const places = document.querySelectorAll('.blank');
    const foodLoc = places[Math.round(Math.random() * places.length)];
    foodLoc && foodLoc.classList.replace('blank', 'food');
    return foodLoc.id.split(',').map((prev) => parseInt(prev));
  };

  const isSnakeHead = (xc, yc) => {
    return xc === snakeBody[0][0] && yc === snakeBody[0][1];
  };

  const reset = () => {
    setSnakeBody(initConfig.pos);
    initConfig.x = 1;
    initConfig.y = 0;
    clearInterval(interval);
    pointCount.current = 0;
    runningStatus = false;
  };

  useEffect(() => {
    const handleChange = () => {
      setSnakeBody((prevBody) => {
        const nx = prevBody[0][0] + initConfig.x;
        const ny = prevBody[0][1] + initConfig.y;
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
          reset();
        }

        const copySnakeBody = prevBody.map((arr) => [...arr]);

        if (foodLoc) {
          if (foodLoc[0] === nx && foodLoc[1] === ny) {
            copySnakeBody.push(foodLoc);
            pointCount.current = pointCount.current + 1;
            foodLoc = placeFood();
          }
        } else {
          foodLoc = placeFood();
        }

        copySnakeBody.pop();
        copySnakeBody.unshift(newHead);
        return copySnakeBody;
      });
    };

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        if (runningStatus === false) {
          runningStatus = true;
          interval = setInterval(handleChange, SPEED);
          return;
        } else {
          runningStatus = false;
          clearInterval(interval);
          return;
        }
      } else if (e.code === 'KeyS') {
        if (initConfig.x === 0 || initConfig.y === 1) {
          return;
        }

        initConfig.y = 1;
        initConfig.x = 0;
      } else if (e.code === 'KeyW') {
        if (initConfig.x === 0 || initConfig.y === 1) {
          return;
        }

        initConfig.y = -1;
        initConfig.x = 0;
      } else if (e.code === 'KeyA') {
        if (initConfig.x === 1 || initConfig.y === 0) {
          return;
        }

        initConfig.x = -1;
        initConfig.y = 0;
      } else if (e.code === 'KeyD') {
        if (initConfig.x === 1 || initConfig.y === 0) {
          return;
        }
        initConfig.x = 1;
        initConfig.y = 0;
      }
    });
  }, []);

  return (
    <section className=" h-dvh w-full bg-slate-200 flex flex-col justify-center items-center">
      <div className=" my-4 border-b border-gray-400 px-10 mr-48">
        <p className=" text-xl font-medium opacity-80">Snake Game</p>
      </div>
      <div className="relative bg-white h-96 w-96 rounded-lg grid grid-cols-[repeat(20,_1fr)] shadow-2xl">
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
        <div className=" absolute -top-16 right-0 text-center p-1 w-44 bg-white rounded-lg flex flex-col">
          <p className=" font-bold">
            High Score : <span>{highScore.current}</span>
          </p>
          <div className=" h-px w-3/4 mx-auto bg-gray-600"></div>
          <p className=" font-medium">{pointCount.current}</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
