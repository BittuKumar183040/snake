import React from 'react';

const SingleBtn = ({ keyCode, label, logo, onClick }) => {
  return (
    <div
      onClick={() => onClick(keyCode)}
      className=" relative bg-slate-400 rounded-md p-4 m-2 shadow-md cursor-pointer active:scale-95"
    >
      {logo}
      <p className=" absolute top-1 left-1 uppercase dark:text-white opacity-50 pointer-events-none text-xs">
        {label}
      </p>
    </div>
  );
};

export default SingleBtn;
