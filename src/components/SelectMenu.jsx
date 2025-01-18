import React, { useEffect, useState, useRef } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { FaAngleUp } from 'react-icons/fa';

const SelectMenu = ({ activeId, items, position = 'bottom', handleClick }) => {
  const [toggle, setToggle] = useState(false);
  const [label, setLabel] = useState(activeId);
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
    setLabel(item.id);
    setToggle(false);
  };
  const itemHeight = 25;
  const height = itemHeight * items.length;
  return (
    <div ref={popupRef} className=" relative select-none">
      <div
        onClick={() => setToggle(!toggle)}
        className="flex gap-2 justify-between items-center text-sm rounded-md border px-2 p-0.5 cursor-pointer"
      >
        <div
          style={{ height: itemHeight + 'px' }}
          className=" flex gap-2 items-center font-bold"
        >
          <img src={items[label].img} alt="" className=" " />
          <p>{items[label].name}</p>
        </div>
        {toggle ? <FaAngleUp /> : <FaAngleDown />}
      </div>
      <div
        style={{ height: toggle ? height + 'px' : '0px' }}
        className={` dark:bg-gray-400 ${toggle ? ` max-w-36 transition-all opacity-100 overflow-hidden ` : 'opacity-0 overflow-hidden bg-red-900 pointer-events-none '} bg-white min-w-28 border rounded-lg backdrop-blur-md bg-opacity-80 absolute 
          ${position === 'top' ? `-top-20` : 'top-8'} right-0`}
      >
        {items.map((item) => (
          <div
            key={item.id}
            title={item.name}
            id={item.id}
            style={{ height: itemHeight + 'px' }}
            onClick={() => handleItemClick(item)}
            className=" flex gap-2 hover:gap-3 cursor-pointer whitespace-nowrap p-1 pr-3 hover:bg-gray-500 hover:text-white font-medium tracking-widest text-xs bg-opacity-30 transition-all"
          >
            <img src={item.img} alt="" className="" />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectMenu;
