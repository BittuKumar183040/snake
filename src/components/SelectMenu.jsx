import React, { useEffect, useState, useRef } from 'react'
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from 'react-icons/fa';

const SelectMenu = ({ title, items, handleClick }) => {
  const [toggle, setToggle] = useState(false)
  const [label, setLabel] = useState(title)
  const popupRef = useRef("")

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    handleClick(item)
    setLabel(item.name)
    setToggle(false)
  }

  return (
    <div ref={popupRef} className=' relative'>
      <div onClick={() => setToggle(!toggle)} className='flex gap-2 items-center text-sm rounded-md border px-2 p-0.5 cursor-pointer'>
        <p>{label}</p>
        {toggle ? <FaAngleUp /> : <FaAngleDown />}
      </div>

      <div className={`${toggle ? " h-[74px] max-w-36 opacity-100" : "h-0 w-0 opacity-0"} bg-white min-w-24 border rounded-lg backdrop-blur-md bg-opacity-80 absolute top-8 right-0 transition-all`}>
        {
          items.map((item) => <p
            key={item.id}
            title={item.name}
            id={item.id}
            onClick={() => handleItemClick(item)}
            className=' cursor-pointer whitespace-nowrap p-1 pr-3 hover:bg-gray-200 text-xs bg-opacity-30 transition-all'
          >
            {item.name}
          </p>)
        }
      </div>
    </div >
  )
}

export default SelectMenu