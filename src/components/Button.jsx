import React from 'react';
import {
  BiDownArrow,
  BiLeftArrow,
  BiRightArrow,
  BiUpArrow,
} from 'react-icons/bi';
import SingleBtn from './SingleBtn';

export const btnSize = 40;
export const btnStyle =
  ' text-gray-900 p-1 dark:text-gray-200 pointer-events-none opacity-80';

const Button = ({ clickedOn }) => {
  return (
    <div className=" flex flex-col justify-between items-center md:absolute right-10 top-3/4">
      <div className=" flex bg-slate-300 dark:bg-slate-900 p-2 pb-0 rounded-t-xl">
        <SingleBtn
          keyCode={'KeyW'}
          label={'up'}
          logo={<BiUpArrow size={btnSize} className={btnStyle} />}
          onClick={(item) => clickedOn(item)}
        />
      </div>
      <div className=" flex bg-slate-300 dark:bg-slate-900 p-2 rounded-lg">
        <SingleBtn
          keyCode={'KeyA'}
          label={'left'}
          logo={<BiLeftArrow size={btnSize} className={btnStyle} />}
          onClick={(item) => clickedOn(item)}
        />
        <SingleBtn
          keyCode={'KeyS'}
          label={'down'}
          logo={<BiDownArrow size={btnSize} className={btnStyle} />}
          onClick={(item) => clickedOn(item)}
        />
        <SingleBtn
          keyCode={'KeyD'}
          label={'right'}
          logo={<BiRightArrow size={btnSize} className={btnStyle} />}
          onClick={(item) => clickedOn(item)}
        />
      </div>
    </div>
  );
};

export default Button;
