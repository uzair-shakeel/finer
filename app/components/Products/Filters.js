"use client";

import { useState, useEffect, useRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Filters = ({ label, type = "list", options, selectedOptions, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (option, keepOpen = false) => {
    if (type === "size" || type === "list") {
      const isSelected = selectedOptions.some((opt) => opt.value === option.value);
      let updatedOptions;
      if (isSelected) {
        updatedOptions = selectedOptions.filter((opt) => opt.value !== option.value);
      } else {
        updatedOptions = [...selectedOptions, option];
      }
      if (onSelect) onSelect(updatedOptions);
    } else if (type === "range" || type === "color") {
      const updatedOptions = [option];
      if (onSelect) onSelect(updatedOptions);
      if (!keepOpen) setIsOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSliderChange = (value) => {
    const [min, max] = value;
    const option = { label: `${min}£ - ${max}£`, value: { min, max } };
    handleOptionClick(option, true);
  };

  const handleMinChange = (e) => {
    const min = Math.min(parseInt(e.target.value) || 0, selectedOptions[0]?.value?.max || 15350);
    const max = selectedOptions[0]?.value?.max || 15350;
    const option = { label: `${min}£ - ${max}£`, value: { min, max } };
    handleOptionClick(option, true);
  };

  const handleMaxChange = (e) => {
    const max = Math.max(parseInt(e.target.value) || 15350, selectedOptions[0]?.value?.min || 0);
    const min = selectedOptions[0]?.value?.min || 0;
    const option = { label: `${min}£ - ${max}£`, value: { min, max } };
    handleOptionClick(option, true);
  };

  const renderOptions = () => {
    switch (type) {
      case "color":
        return (
          <div className="p-6 flex flex-col">
            <h1 className="text-[24px] leading-[29px] font-semibold mb-3">Dial Colour</h1>
            <div className="flex gap-3 flex-wrap">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`flex items-center gap-2 border rounded-[100px] min-h-[31px] px-6 ${
                    selectedOptions.some((opt) => opt.value === option.value)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-black text-black"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full ${option.label === "White" ? "border border-black" : ""}`}
                    style={{ background: option.color }}
                  ></div>
                  <span className="text-[16px] leading-[19px] font-normal">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case "range":
        const initialRange = selectedOptions[0]?.value || { min: 0, max: 15350 };
        return (
          <div className="p-6">
            <h1 className="text-[24px] leading-[29px] font-semibold mb-6">Price</h1>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-[16px] leading-[19px] font-normal">0£</h1>
              <h1 className="text-[16px] leading-[19px] font-normal">15,350£</h1>
            </div>
            <div className="mb-6 px-2">
              <Slider
                range
                min={0}
                max={15350}
                step={50}
                value={[initialRange.min, initialRange.max]}
                onChange={handleSliderChange}
                trackStyle={{ backgroundColor: "#017EFE", height: "4px" }}
                handleStyle={{
                  borderColor: "#017EFE",
                  backgroundColor: "#017EFE",
                  width: "16px",
                  height: "16px",
                  marginTop: "-6px",
                  opacity: "100",
                }}
                railStyle={{ backgroundColor: "#828282", height: "5px" }}
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <input
                type="number"
                value={initialRange.min}
                onChange={handleMinChange}
                min="0"
                max={initialRange.max}
                className="w-[205px] px-3 h-[42px] rounded-[30px] outline-none bg-[#E3E8ED] placeholder:text-gray-500"
                placeholder="0£"
              />
              <span className="text-sm text-gray-700">-</span>
              <input
                type="number"
                value={initialRange.max}
                onChange={handleMaxChange}
                min={initialRange.min}
                max="15350"
                className="w-[205px] px-3 h-[42px] rounded-[30px] outline-none bg-[#E3E8ED] placeholder:text-gray-500"
                placeholder="15,350£"
              />
            </div>
          </div>
        );
      case "size":
        return (
          <div className="p-6">
            {options.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6 last:mb-0">
                <h4 className="text-[24px] leading-[29px] font-semibold text-black mb-3">{group.label}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.sizes.map((size, sizeIndex) => (
                    <label key={sizeIndex} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOptions.some((opt) => opt.value === size)}
                        onChange={() => handleOptionClick({ label: `${size}mm`, value: size })}
                        className="hidden"
                      />
                      <span
                        className={`px-6 min-h-[31px] flex items-center justify-center border rounded-full text-base leading-[19px] font-normal cursor-pointer ${
                          selectedOptions.some((opt) => opt.value === size)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-black border-black"
                        }`}
                      >
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case "list":
      default:
        return (
          <div className="p-6 flex flex-col">
            <h1 className="text-[24px] leading-[29px] font-semibold mb-3">Brands</h1>
            <div className="flex items-center flex-wrap gap-3">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option, true)}
                  className={`border h-[31px] rounded-[100px] px-6 text-base leading-[19px] font-normal ${
                    selectedOptions.some((opt) => opt.value === option.value)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-black text-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="inline-block w-full md:w-auto" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`flex items-center text-nowrap justify-between gap-2.5 w-full md:w-auto px-6 min-h-[37px] text-[16px] leading-[19px] font-normal rounded-[30px] ${
          isOpen ? "bg-[#017EFE] text-white" : "bg-white text-black"
        }`}
      >
        {label}
        <svg
          className={`w-auto h-[11px] transition-transform duration-200 ${isOpen ? "-rotate-90 text-[#FFFFFF]" : "text-[#828282]"}`}
          viewBox="0 0 17 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 1.5L8.5 9.5L15.5 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[calc(100vw-2rem)] max-w-[800px] mx-auto rounded-[20px] bg-white z-50"
          style={{ boxShadow: "0px 8px 12px 1px #00000026" }}
        >
          {renderOptions()}
        </div>
      )}
    </div>
  );
};

export default Filters;