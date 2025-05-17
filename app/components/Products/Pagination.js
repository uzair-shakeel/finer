"use client";

import { useState } from "react";

const Pagination = ({ totalItems, itemsPerPage, onPageChange, currentPage }) => {
     const totalPages = Math.ceil(totalItems / itemsPerPage);

     const handlePageChange = (page) => {
          if (page >= 1 && page <= totalPages) {
               onPageChange(page);
          }
     };

     const getPageNumbers = () => {
          const pageNumbers = [];
          const maxPagesToShow = 5;
          let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
          let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

          if (endPage - startPage + 1 < maxPagesToShow) {
               startPage = Math.max(1, endPage - maxPagesToShow + 1);
          }

          for (let i = startPage; i <= endPage; i++) {
               pageNumbers.push(i);
          }

          return pageNumbers;
     };

     return (
          <div className="flex items-center justify-center gap-2 mt-12">
               <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-[87px] h-[30px] flex items-center gap-3 justify-center border border-[#828282] bg-transparent disabled:cursor-not-allowed rounded-[5px] text-[#828282] text-base font-normal leading-[12px]"
               >
                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M8 15L1 8L8 1" stroke="#828282" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Prev
               </button>
               {getPageNumbers().map((number) => (
                    <button
                         key={number}
                         onClick={() => handlePageChange(number)}
                         className={`min-w-[30px] h-[30px] text-base font-normal rounded-[5px] ${currentPage === number
                              ? "border border-[#017EFE] text-[#017EFE]"
                              : "bg-transparent text-[#828282]"
                              }`}
                    >
                         {number}
                    </button>
               ))}
               <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-[87px] h-[30px] flex items-center gap-3 justify-center border border-[#828282] bg-transparent disabled:cursor-not-allowed rounded-[5px] text-[#828282] text-base font-normal leading-[12px]"
               >
                    Next
                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M1 1L8 8L1 15" stroke="#828282" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
               </button>
          </div>
     );
};

export default Pagination;