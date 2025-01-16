import React from 'react';
import {
  BiDownArrow,
  BiLeftArrow,
  BiRightArrow,
  BiUpArrow,
} from 'react-icons/bi';

const Button = ({ clickedOn }) => {
  const btnSize = 40;
  return (
    <div className=" flex flex-col justify-between items-center mt-10">
      <div className=" flex bg-slate-300 dark:bg-slate-900 p-2 pb-0 rounded-t-xl">
        <p
          onClick={() => clickedOn('KeyW')}
          className=" bg-slate-400 rounded-md p-4 m-2 shadow-md cursor-pointer active:scale-95"
        >
          <BiUpArrow
            size={btnSize}
            className=" text-gray-900 p-1 dark:text-gray-200 pointer-events-none"
          />
        </p>
      </div>
      <div className=" flex bg-slate-300 dark:bg-slate-900 p-2 rounded-lg">
        <p
          onClick={() => clickedOn('KeyA')}
          className=" bg-slate-400 rounded-md p-4 m-2 shadow-md cursor-pointer active:scale-95"
        >
          <BiLeftArrow
            size={btnSize}
            className=" text-gray-900 p-1 dark:text-gray-200 pointer-events-none"
          />
        </p>
        <p
          onClick={() => clickedOn('KeyS')}
          className=" bg-slate-400 rounded-md p-4 m-2 shadow-md cursor-pointer active:scale-95"
        >
          <BiDownArrow
            size={btnSize}
            className=" text-gray-900 p-1 dark:text-gray-200 pointer-events-none"
          />
        </p>
        <p
          onClick={() => clickedOn('KeyD')}
          className=" bg-slate-400 rounded-md p-4 m-2 shadow-md cursor-pointer active:scale-95"
        >
          <BiRightArrow
            size={btnSize}
            className=" text-gray-900 p-1 dark:text-gray-200 pointer-events-none"
          />
        </p>
      </div>
    </div>
  );
};

export default Button;
