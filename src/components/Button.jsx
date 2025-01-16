import React from 'react';
import {
  BiDownArrow,
  BiLeftArrow,
  BiReset,
  BiRightArrow,
  BiUpArrow,
} from 'react-icons/bi';
import { CgPlayButton } from 'react-icons/cg';

const Button = ({ clickedOn }) => {
  const btnSize = 40;
  return (
    <div className=" flex flex-col justify-between items-center mt-10">
      <div className='mb-10 flex gap-4 '>
        <div onClick={() => clickedOn('Enter')} className=' active:scale-95 cursor-pointer shadow-md px-5 bg-slate-300 text-gray-900 dark:text-gray-200 rounded-lg'>
          <CgPlayButton size={50} className=' pointer-events-none' />
        </div>
        <div onClick={() => clickedOn('Reset')} className=' active:scale-95 cursor-pointer px-5 bg-slate-300 opacity-60 text-gray-900 dark:text-gray-200 rounded-lg'>
          <BiReset size={50} className=' p-3 pointer-events-none' />
        </div>
      </div>

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
