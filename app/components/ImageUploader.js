import Image from "next/image";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ImageUploader = ({ onImagesChange, disabled }) => {
    const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter((file) => {
      return (
        (file.type.startsWith("image/") && file.type !== "image/gif") ||
        file.type.startsWith("video/")
      );
    });

    if (files.length !== validFiles.length) {
      toast.error(
        "GIF files are not allowed. Only images and videos can be uploaded."
      );
    }

    const newImageFiles = [...images];

    validFiles.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      newImageFiles.push({
        file,
        preview: previewUrl,
        isVideo: file.type.startsWith("video/"),
      });
    });

    setImages(newImageFiles);

    if (onImagesChange) {
      onImagesChange(newImageFiles.map((img) => img.file));
    }

    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  const handleRemove = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    if (onImagesChange) {
      onImagesChange(updatedImages.map((img) => img.file));
    }

    toast.success("File removed successfully");
  };

  // Handler for clicking on the main container div
  const handleContainerClick = () => {
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <label className="block text-base font-normal text-black mb-2 md:mb-3">
        {t("form.uploadFileTitle")}
      </label>
      <div
        className={`h-[200px] md:min-h-[191px] group rounded-[20px] md:rounded-[30px] p-3 md:p-4 flex flex-col items-start justify-start bg-[#E3E8ED] cursor-pointer `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleContainerClick}
      >
        <input
          type="file"
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
          multiple
          accept="image/jpeg, image/png, image/webp, image/jpg, image/bmp, image/tiff, video/*"
          onChange={(e) => handleFiles(Array.from(e.target.files))}
          disabled={disabled}
        />
        {images.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div
              className="w-[100px] h-[100px] cursor-pointer "
            >
              <Image
                src="/assets/file-upload.svg"
                alt="upload"
                width={100}
                height={100}
                className="group-hover:hidden"
              />
              <Image
                src="/assets/file-upload-hover.svg"
                alt="upload"
                width={100}
                height={100}
                className="hidden group-hover:block"
              />
            </div>
            <p className="text-[#828282] text-sm md:text-base font-normal mt-2 text-center">
              {t("form.dragAndDrop")}
            </p>
            <p className="text-[#828282] text-xs font-normal mt-1 text-center">
              {t("form.supportsImages")}
            </p>
          </div>
        ) : (
          <div 
            className="w-full h-full flex flex-wrap gap-2 md:gap-3 overflow-y-auto scrollbar-hide !overflow-visible"
            onClick={(e) => e.stopPropagation()}  
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-16 w-16 md:w-20 md:h-20"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {image.isVideo ? (
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center relative">
                    <video
                      src={image.preview}
                      className="object-cover w-full h-full rounded-[14px]"
                    />
                  </div>
                ) : (
                  <Image
                    src={image.preview}
                    alt={`uploaded-${index}`}
                    fill
                    className="object-cover rounded-[14px]"
                  />
                )}
                {(hoveredIndex === index || window.innerWidth < 768) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent container click when removing
                      handleRemove(index);
                    }}
                    className="absolute !z-50 -top-2 -right-2 w-6 h-6 group"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="0.5"
                        width="23"
                        height="23"
                        rx="5.5"
                        fill="white"
                      />
                      <rect
                        x="0.5"
                        y="0.5"
                        width="23"
                        height="23"
                        rx="5.5"
                        stroke="#828282"
                        className="group-hover:stroke-[#B80000]"
                      />
                      <path
                        d="M18 6L12 12M12 12L6 18M12 12L6 6M12 12L18 18"
                        stroke="#828282"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:stroke-[#B80000]"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <label
              htmlFor="file-upload"
              className="h-16 w-16 md:w-20 md:h-20 overflow-visible flex items-center justify-center bg-white border border-[#828282] hover:border-[#017EFE] rounded-[14px] cursor-pointer group"
              onClick={(e) => e.stopPropagation()} // Prevent container click when clicking the + button
            >
              <svg
                className="text-[#828282] group-hover:text-[#017EFE]"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 1V31M1 16L31 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;