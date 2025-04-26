'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageSlider({ images, coverImage }) {
     const [displayedImage, setDisplayedImage] = useState(coverImage);
     const [selectedThumbnail, setSelectedThumbnail] = useState(-1);

     const selectImage = (index) => {
          setSelectedThumbnail(index);
          setDisplayedImage(images[index]);
     };

     const goToPrevious = () => {
          if (selectedThumbnail === -1) {
               selectImage(images.length - 1);
               return;
          }

          const isFirstSlide = selectedThumbnail === 0;
          const newIndex = isFirstSlide ? images.length - 1 : selectedThumbnail - 1;
          selectImage(newIndex);
     };

     const goToNext = () => {
          if (selectedThumbnail === -1) {
               selectImage(0);
               return;
          }

          const isLastSlide = selectedThumbnail === images.length - 1;
          const newIndex = isLastSlide ? 0 : selectedThumbnail + 1;
          selectImage(newIndex);
     };

     return (
          <div className="w-full relative">
               {/* Main image container */}
               <div className="w-full h-[320px] sm:h-[636px] relative overflow-hidden bg-white rounded-[20px]">
                    {/* Left arrow */}
                    <div
                         className="absolute top-1/2 left-3 md:left-6 -translate-y-1/2 cursor-pointer z-10"
                         onClick={goToPrevious}
                    >
                         <svg className='md:w-[20px] md:h-[36px] w-[10px] h-[20px]' viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 34L2 18L18 2" stroke="#828282" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                    </div>

                    {/* Main image */}
                    <div className="w-full h-full flex justify-center items-center">
                         <div className="relative w-full h-full transition-all duration-500 ease-in-out">
                              <Image
                                   src={displayedImage}
                                   alt="Product image"
                                   width={2000}
                                   height={2000}
                                   // fill
                                   className='rounded-[20px] w-full h-full'
                                   draggable="false"
                                   style={{ objectFit: "cover" }}
                                   priority
                              />
                         </div>
                    </div>

                    {/* Right arrow */}
                    <div
                         className="absolute top-1/2 right-3 md:right-6 -translate-y-1/2 cursor-pointer z-10"
                         onClick={goToNext}
                    >
                         <svg className='md:w-[20px] md:h-[36px] w-[10px] h-[20px]' viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 34L18 18L2 2" stroke="#828282" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                    </div>
               </div>

               {/* Thumbnail navigation */}
               <div className="flex overflow-x-auto mt-3 md:mt-6 gap-2 md:gap-6">
                    {images.map((image, index) => (
                         <div
                              key={index}
                              className={`relative bg-white rounded-[10px] flex-shrink-0 w-full max-w-[74px] h-[74px] md:max-w-[86px] md:h-[86px] cursor-pointer transition-all ${index === selectedThumbnail ? '' : ''
                                   }`}
                              onClick={() => selectImage(index)}
                         >
                              <Image
                                   src={image}
                                   alt={`Thumbnail ${index + 1}`}
                                   fill
                                   draggable="false"
                                   style={{ objectFit: "cover" }}
                                   className="rounded-[10px]"
                              />
                         </div>
                    ))}
               </div>
          </div>
     );
}