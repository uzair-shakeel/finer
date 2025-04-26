import { useState } from "react";

const Checkbox = ({ checked, onChange, title }) => {
     const [isHovered, setIsHovered] = useState(false);

     return (
          <div className="flex items-center gap-2 md:gap-3 group">
               <label className="cursor-pointer">
                    <input
                         type="checkbox"
                         className="hidden"
                         checked={checked}
                         onChange={onChange}
                    />
                    <div
                         className={`border bg-[#F5F8FF] ${checked ? "border-[#017EFE]" : "border-[#828282]"} transition-all duration-300 w-[19px] h-[19px] md:w-[25px] md:h-[25px] rounded-sm md:rounded-md flex items-center justify-center`}
                         onMouseEnter={() => setIsHovered(true)}
                         onMouseLeave={() => setIsHovered(false)}
                    >
                         {checked ? (
                              <svg className="text-[#017EFE]" width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <path d="M1 3.75L7.5 10.25L17 0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                         ) : (
                              isHovered && (
                                   <>
                                        <svg className="text-[#828282]" width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M1 3.75L7.5 10.25L17 0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                   </>
                              )
                         )}
                    </div>
               </label>
               <h3 className={`group ${checked ? "text-black" : "text-[#828282]"} text-sm md:text-base font-normal group-hover:text-black`}>{title}</h3>
          </div>
     );
};

export default Checkbox;
