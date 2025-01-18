import React from 'react';
import { SQUARE } from '../section/Hero';

const Area = ({ snakeBody }) => {
  const GRID = Array.from({ length: SQUARE }, () => new Array(SQUARE).fill(''));

  const isSnakeBody = (xc, yc) => {
    return snakeBody.some(([x, y]) => {
      return x === xc && y === yc;
    });
  };

  const isSnakeHead = (xc, yc) => {
    return xc === snakeBody[0][0] && yc === snakeBody[0][1];
  };

  return (
    <>
      {GRID.map((row, yc) => {
        return row.map((cell, xc) => {
          return (
            <div
              key={`${xc}${yc}`}
              id={`${xc}_${yc}`}
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
    </>
  );
};

export default Area;
