import React, { useEffect, useState, useRef } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { FaAngleUp } from 'react-icons/fa';

const SelectMenu = ({ title, items, position = 'bottom', handleClick }) => {
  const [toggle, setToggle] = useState(false);
  const [label, setLabel] = useState(title);
  const popupRef = useRef('');

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    handleClick(item);
    setLabel(item.name);
    setToggle(false);
  };
  const height = 25 * items.length;
  return (
    <div ref={popupRef} className=" relative select-none">
      <div
        onClick={() => setToggle(!toggle)}
        className="flex gap-2 justify-between items-center text-sm rounded-md border px-2 p-0.5 cursor-pointer"
      >
        <p>{label}</p>
        {toggle ? <FaAngleUp /> : <FaAngleDown />}
      </div>
      <div
        style={{ height: toggle ? height + 'px' : '0px' }}
        className={` dark:bg-gray-400 ${toggle ? ` max-w-36 transition-all opacity-100 overflow-hidden ` : 'opacity-0 overflow-hidden bg-red-900 pointer-events-none '} bg-white min-w-24 border rounded-lg backdrop-blur-md bg-opacity-80 absolute 
          ${position === 'top' ? `-top-20` : 'top-8'} right-0`}
      >
        {items.map((item) => (
          <p
            key={item.id}
            title={item.name}
            id={item.id}
            onClick={() => handleItemClick(item)}
            className=" cursor-pointer whitespace-nowrap p-1 pr-3 hover:bg-gray-500 hover:text-white font-semibold text-xs bg-opacity-30 transition-all"
          >
            {item.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SelectMenu;
