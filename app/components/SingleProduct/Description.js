'use client'

import React from "react";

const Description = ({ product }) => {
     return (
          <div className="mt-3 md:mt-6 bg-white rounded-[20px] pl-6 pt-6 pr-6 md:pr-[45px] pb-6 md:pb-12">
               <h3 className="mb-3 md:mb-6 text-[#000000] text-[18px] sm:text-[24px] font-semibold leading-[17px] sm:leading-[23px]">
                    Description
               </h3>
               <p className="text-[#000000] text-[14px] sm:text-[16px] font-normal leading-[119%]">
                    {product.description || 'No description available'}
               </p>
          </div>
     );
};

export default Description;
