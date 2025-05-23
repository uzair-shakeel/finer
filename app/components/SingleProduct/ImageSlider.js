"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageSlider({ images, coverImage }) {
  const [displayedImage, setDisplayedImage] = useState(coverImage);
  const [selectedThumbnail, setSelectedThumbnail] = useState(-1);
  const [imageError, setImageError] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  // Reset the display when images array changes
  useEffect(() => {
    if (images && images.length > 0) {
      setDisplayedImage(images[0]);
      setSelectedThumbnail(0);
      setImageError(false);
      console.log(
        "ImageSlider: Images changed, setting initial image",
        images[0]
      );
    }
  }, [images]); // Re-run this effect whenever the images array changes

  // Debug log when images change
  useEffect(() => {
    console.log("ImageSlider: Images array updated", {
      imagesCount: images?.length,
      imageURLs: images,
      selectedIndex: selectedThumbnail,
      displayedImage,
      coverImage,
    });
  }, [images, coverImage, selectedThumbnail, displayedImage]);

  const selectImage = (index) => {
    if (index >= 0 && index < images.length) {
      setSelectedThumbnail(index);
      setDisplayedImage(images[index]);
      setImageError(false);
      console.log("ImageSlider: Selected image at index", index, images[index]);
    } else {
      console.error(
        "ImageSlider: Invalid image index",
        index,
        "max index:",
        images.length - 1
      );
    }
  };

  const goToPrevious = () => {
    if (images.length === 0) return;

    if (selectedThumbnail === -1) {
      selectImage(images.length - 1);
      return;
    }

    const isFirstSlide = selectedThumbnail === 0;
    const newIndex = isFirstSlide ? images.length - 1 : selectedThumbnail - 1;
    selectImage(newIndex);
  };

  const goToNext = () => {
    if (images.length === 0) return;

    if (selectedThumbnail === -1) {
      selectImage(0);
      return;
    }

    const isLastSlide = selectedThumbnail === images.length - 1;
    const newIndex = isLastSlide ? 0 : selectedThumbnail + 1;
    selectImage(newIndex);
  };

  const handleImageError = (e) => {
    console.error("ImageSlider: Image loading error for", displayedImage, e);
    setImageError(true);
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMagnifierPosition({
      x: Math.max(100, Math.min(x, rect.width - 100)),
      y: Math.max(100, Math.min(y, rect.height - 100)),
    });
  };

  return (
    <div className="w-full relative">
      {/* Main image container */}
      <div className="w-full h-[320px] sm:h-[636px] relative overflow-hidden bg-white rounded-[20px]">
        {/* Left arrow */}
        {images.length > 1 && (
          <div
            className="absolute top-1/2 left-3 md:left-6 -translate-y-1/2 cursor-pointer z-10"
            onClick={goToPrevious}
          >
            <svg
              className="md:w-[20px] md:h-[36px] w-[10px] h-[20px]"
              viewBox="0 0 20 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 34L2 18L18 2"
                stroke="#828282"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Main image */}
        <div className="w-full h-full flex justify-center items-center">
          {images.length === 0 ? (
            <div className="text-center text-gray-400">
              <p>No images available</p>
            </div>
          ) : imageError ? (
            <div className="text-center text-gray-400">
              <p>Image could not be loaded</p>
              <p className="text-xs mt-2">{displayedImage}</p>
            </div>
          ) : (
            <div
              className="relative w-full h-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              style={{ cursor: "none" }}
            >
              <Image
                src={displayedImage || "/placeholder.svg"}
                alt="Product image"
                width={2000}
                height={2000}
                className="rounded-[20px] w-full h-full"
                draggable="false"
                style={{ objectFit: "cover", cursor: "none" }}
                priority
                onError={handleImageError}
              />
              {showMagnifier && (
                <div
                  className="absolute pointer-events-none rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden"
                  style={{
                    width: "200px",
                    height: "200px",
                    left: magnifierPosition.x - 100,
                    top: magnifierPosition.y + 20,
                    zIndex: 2,
                    cursor: "none",
                  }}
                >
                  <Image
                    src={displayedImage || "/placeholder.svg"}
                    alt="Zoomed product image"
                    width={2000}
                    height={2000}
                    className="rounded-lg"
                    style={{
                      objectFit: "none",
                      width: "800px",
                      height: "800px",
                      objectPosition: `${-4 * (magnifierPosition.x - 100)}px ${
                        -4 * (magnifierPosition.y - 100)
                      }px`,
                      cursor: "none",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right arrow */}
        {images.length > 1 && (
          <div
            className="absolute top-1/2 right-3 md:right-6 -translate-y-1/2 cursor-pointer z-10"
            onClick={goToNext}
          >
            <svg
              className="md:w-[20px] md:h-[36px] w-[10px] h-[20px]"
              viewBox="0 0 20 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 34L18 18L2 2"
                stroke="#828282"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto scrollbar-hide mt-3 md:mt-6 gap-2 md:gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-[10px] overflow-hidden flex-shrink-0 w-full max-w-[74px] h-[74px] md:max-w-[86px] md:h-[86px] cursor-pointer transition-all ${
                index === selectedThumbnail
                  ? "border-2 border-[#017EFE]"
                  : "border border-[#E3E8ED]"
              }`}
              onClick={() => selectImage(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                fill
                draggable="false"
                style={{ objectFit: "cover" }}
                className=""
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
