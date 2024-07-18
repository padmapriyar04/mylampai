import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import Lessonsdiv01 from "./lessondivdropdown";
import Lessonsdiv from "./Lessonsdiv";

type CustomEvent = MouseEvent | TouchEvent;

const MyComponent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: CustomEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="relative flex justify-center bg-red-300">
      {/* Trigger button */}
      <button
        onClick={toggleDropdown}
        className="py-2 px-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        {isActive ? <FaTimes className="w-5 h-5" /> : <FaChevronDown className="w-5 h-5" />}
      </button>

      {/* Blurred background */}
      {isActive && (
        <div className="fixed inset-0 bg-gray-800 opacity-30 blur"></div>
      )}

      {/* Dropdown menu */}
      <div
        className={`absolute mt-2 top-full left-1/2 transform w-full -translate-x-1/2  shadow-md rounded overflow-hidden ${isActive ? 'block' : 'hidden'}`}
        ref={dropdownRef}
      >
        <Lessonsdiv01 />
      </div>
    </div>
  );
};

export default MyComponent;
