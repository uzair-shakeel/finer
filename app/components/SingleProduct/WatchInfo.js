"use client";
import Cross from "@/app/SvgIcons/Cross";
import Right from "@/app/SvgIcons/Right";
import ShareIcon from "@/app/SvgIcons/ShareIcon";
import React, { useState, useRef, useEffect } from "react";
import ConditionsModal from "../Tabs/ConditionsModal";
import Image from "next/image";
import ModalClose from "@/app/SvgIcons/ModalClose";
import Checkbox from "../Checkbox";
import { useTranslation } from "react-i18next";
import { scrollToHomeFormSection } from "@/app/utils/navigation";

const WatchInfo = ({ product }) => {
  const { t } = useTranslation();
  const [isSendOfferModalOpen, setIsSendOfferModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    offerPrice: "",
    agreeToTerms: false,
    callToConfirm: false,
  });

  // Check product status
  const isSoldOut = product?.status === "sold_out";
  const isReserved = product?.status === "reserved";
  const isInStock = product?.status === "in_stock";

  const openSendOfferModal = () => setIsSendOfferModalOpen(true);
  const closeSendOfferModal = () => setIsSendOfferModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    closeModal();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const modalRef = useRef(null);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this video",
          text: "I found this interesting video I thought you might like",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.log("Error copying to clipboard:", error));
    }
  };

  // Modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "£0";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Simple price logic
  const price = product.price || 0;
  const originalPrice = product.originalPrice || 0;

  // Check if there is a discount
  const hasDiscount =
    price > product?.discountedPrice && product?.discountedPrice > 0;

  // Calculate savings amount
  const savings = hasDiscount ? price - product?.discountedPrice : 0;

  // Check if the product has RRP info
  const hasRRP = product.rrp && product.rrp > 0;

  // Check if promo code should be shown (no discount and not sold out)
  const shouldShowPromoCode = !hasDiscount && !isSoldOut;

  const handleBuyClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("buyFormProduct");
      sessionStorage.removeItem("buyFormData");
    }

    const prefillText = `Item: ${product.brand} ${product.model}\nBrand: ${
      product.brand
    }\nModel: ${product.model}\nReference: ${product.reference}\nYear: ${
      product.year
    }\nCondition: ${product.condition?.overall}\nPrice: ${
      isSoldOut ? "Sold Out" : formatPrice(price)
    }`;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("buyFormProduct", JSON.stringify(product));
      sessionStorage.setItem("buyFormData", prefillText);
      sessionStorage.setItem("setActiveHomeTab", isSoldOut ? "source" : "buy");
    }

    scrollToHomeFormSection(isSoldOut ? "source" : "buy");
  };

  return (
    <div className="bg-white rounded-[20px] w-full p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[#828282] text-[14px] sm:text-[16px] font-normal leading-[10px] sm:leading-[12px]">
          999 views in 48 hours
        </h3>
        <div className="">
          <button
            className="w-8 h-8 sm:w-[36px] sm:h-[36px] rounded-full bg-[#ECF0F3] flex items-center justify-center"
            onClick={handleShare}
          >
            <ShareIcon />
          </button>
        </div>
      </div>

      <div className="mt-0.5 sm:mt-2 space-y-2 sm:space-y-3">
        <h3 className="text-black text-[16px] sm:text-[18px] font-normal leading-[12px] sm:leading-[13px]">
          {product?.brand}
        </h3>
        <h1 className="text-black text-[24px] sm:text-[32px] font-semibold leading-[17px] sm:leading-[29px]">
          {product?.pageTitle}{" "}
        </h1>
        <h3 className="text-black pt-1 text-[16px] sm:text-[18px] font-normal leading-[12px] sm:leading-[13px]">
          {product?.subdescription}
        </h3>
      </div>

      <div className="mt-3 sm:mt-6 w-fit bg-[#ECF0F3] p-[12px] rounded-[12px]">
        <div className="flex md:items-center md:flex-row flex-col gap-3">
          <h3 className="text-[#000000] text-[14px] sm:text-[16px] font-normal leading-[10px] sm:leading-[12px]">
            Year {product?.year || "N/A"}
          </h3>
          <div className="flex items-center gap-3">
            <h3 className="flex items-center gap-2 text-black text-[14px] sm:text-[16px] leading-[10px] sm:leading-[12px] font-normal">
              Box {product.condition.hasBox === true ? <Right /> : <Cross />}
            </h3>
            <h3 className="flex items-center gap-2 text-black text-[14px] sm:text-[16px] leading-[10px] sm:leading-[12px] font-normal">
              Papers{" "}
              {product.condition.hasPapers === true ? <Right /> : <Cross />}
            </h3>
          </div>
        </div>
        <div className="mt-3 hidden md:flex items-center gap-2">
          <h3 className="text-black text-[16px] leading-[19px] font-normal">
            Condition:
          </h3>
          <h3 className="text-black text-[16px] leading-[19px] font-normal">
            {product?.condition?.status || "Good"}
          </h3>
          <div>
            <div className="text-gray-400 cursor-pointer" onClick={openModal}>
              <Image
                src="/assets/conditions.svg"
                alt="conditions"
                width={17}
                height={17}
              />
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div
                  ref={modalRef}
                  className="bg-white rounded-[20px] p-6 max-w-3xl w-full min-h-[85vh] max-h-[85vh] lg:max-h-fit lg:min-h-fit overflow-y-auto scrollbar-hide"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Condition</h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ModalClose />
                    </button>
                  </div>
                  <ConditionsModal />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        {isSoldOut ? (
          <h3 className="text-[#FF0000] text-[24px] sm:text-[32px] font-semibold leading-[17px] sm:leading-[23px]">
            Sold Out
          </h3>
        ) : (
          <>
            <div className="flex flex-col gap-[12px]">
              {/* Main price */}
              <div className="flex items-end gap-[12px]">
                <h3
                  className={`${
                    product?.discountedPrice > 0
                      ? "text-[#017EFE]"
                      : "text-black"
                  } text-[24px] sm:text-[32px] font-semibold leading-[17px] sm:leading-[23px]`}
                >
                  {product?.discountedPrice > 0
                    ? formatPrice(product?.discountedPrice)
                    : formatPrice(product?.price)}
                </h3>
                {product?.discountedPrice > 0 && (
                  <h3 className="text-[#828282] text-[18px] sm:text-[24px] font-normal leading-[17px] sm:leading-[23px] line-through">
                    {formatPrice(product?.price)}
                  </h3>
                )}
              </div>

              {/* Savings amount */}
              {product?.discountedPrice > 0 && (
                <h3 className="text-[#017EFE] text-[14px] sm:text-[16px] font-medium">
                  Save {formatPrice(product?.price - product?.discountedPrice)}
                </h3>
              )}
            </div>
          </>
        )}
        <div className="my-[12px] sm:mt-[12px] text-[#828282] text-[14px] sm:text-[16px] font-normal leading-[10px] sm:leading-[12px]">
          <div>RRP: {formatPrice(product.originalPrice)}</div>
        </div>

        <div className="flex items-center gap-2 ">
          {isSoldOut ? (
            <div></div>
          ) : isReserved ? (
            <div className="flex items-center">
              <span className="flex items-center gap-2 bg-[#ECF0F3] px-3 py-1 rounded-full text-sm ">
                Reserved
                <div className="status-in-stock bg-[#FF9D00]"></div>
              </span>
            </div>
          ) : isInStock ? (
            <div className="flex items-center">
              <span className="mt-5 flex items-center gap-2 bg-[#ECF0F3] px-3 py-1 rounded-full text-sm font-medium">
                In Stock
                <div className="status-in-stock bg-[#60FF7D]"></div>
              </span>
            </div>
          ) : (
            <div></div>
          )}

          {/* Promo Code Banner - Only shown for products without discount and not sold out */}
          {shouldShowPromoCode && (
            <div className="mt-5 flex items-center gap-2 bg-[#ECF0F3] px-3 py-1 rounded-full text-sm font-medium">
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.83268 4.16667H14.166C14.6223 4.16667 14.9993 4.54364 14.9993 5V15C14.9993 15.4564 14.6223 15.8333 14.166 15.8333H5.83268C5.37644 15.8333 4.99935 15.4564 4.99935 15V5C4.99935 4.54364 5.37644 4.16667 5.83268 4.16667Z"
                    stroke="#1F1F1F"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.3327 2.5V5.83333"
                    stroke="#1F1F1F"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.66602 2.5V5.83333"
                    stroke="#1F1F1F"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.99935 9.16667H14.9993"
                    stroke="#1F1F1F"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-black font-semibold">
                  100£ OFF! With Code:{" "}
                  <span className="bg-white ml-1 px-1.5 py-[0.8px] rounded-full ">
                    RABBIT
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex items-center gap-2">
        <Image
          src="/assets/visa-card.svg"
          alt="visa-card"
          width={50}
          height={50}
          priority
        />
        <Image
          src="/assets/master-card.svg"
          alt="master-card"
          width={50}
          height={50}
          priority
        />
        <Image
          src="/assets/amex-card.svg"
          alt="amex-card"
          width={50}
          height={50}
          priority
        />
        <Image
          src="/assets/bitcoin-card.svg"
          alt="bitcoin-card"
          width={50}
          height={50}
          priority
        />
      </div>

      {isSoldOut ? (
        <button
          onClick={handleBuyClick}
          className="mt-3 bg-[#017EFE] w-full px-8 md:px-10 rounded-[60px] text-white text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:bg-[#003D7B]"
        >
          Source
        </button>
      ) : isReserved ? (
        <button
          onClick={handleBuyClick}
          disabled
          className="mt-3 bg-[#FF9800] w-full px-8 md:px-10 rounded-[60px] text-white text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:bg-[#E65100]"
        >
          Reserved
        </button>
      ) : (
        <button
          onClick={handleBuyClick}
          className="mt-3 bg-[#017EFE] w-full px-8 md:px-10 rounded-[60px] text-white text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:bg-[#003D7B]"
        >
          Buy
        </button>
      )}

      <button
        onClick={openSendOfferModal}
        className="mt-3 flex items-center justify-center !leading-[19px] w-full px-8 md:px-10 rounded-[60px] text-[#017EFE] text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:text-white hover:bg-[#017EFE] border-2 border-[#017EFE]"
      >
        Part Exchange
      </button>

      {/* Modal */}
      {isSendOfferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5">
          {/* Modal Content */}
          <div className="bg-white rounded-[20px] max-w-[703px] mx-auto w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[24px] font-semibold leading-[23px] text-black">
                Send and offer
              </h2>
              <button
                onClick={closeSendOfferModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Selected Item */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <span className="text-black text-[16px] font-normal leading-[19px]">
                    Selected Item
                  </span>
                  <button
                    type="button"
                    className="md:block hidden text-[#828282] text-[16px] font-normal leading-[12px]"
                  >
                    Change Item
                  </button>
                </div>
                <div className="flex items-start gap-[15px] bg-white rounded-[15px] sm:rounded-[20px] border border-[#E3E8ED] pl-2 py-2 pr-4">
                  <div className="w-[70px] h-[70px] relative flex-shrink-0">
                    <div className="bg-white">
                      <Image
                        src="/assets/rolex-daytona-116500ln-panda-cover.webp"
                        alt="Rolex GMT-Master II"
                        width={70}
                        height={70}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex items-start sm:items-center sm:flex-row flex-col justify-between gap-3 w-full">
                    <div className="flex-grow">
                      <div className="text-black text-[14px] sm:text-[20px] font-semibold leading-[10px] sm:leading-[15px] mb-2 sm:mb-3">
                        GMT-Master II
                      </div>
                      <div className="text-[16px] font-normal text-black leading-[12px]">
                        Rolex<span className="pl-2 sm:pl-3">126720VTNR</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-[18px]">
                      <div className="text-[#017EFE] font-semibold text-[18px] sm:text-[24px] leading-[22px] sm:leading-[29px]">
                        €12,700
                      </div>
                      <div className="text-[#828282] text-[14px] sm:text-[16px] leading-[17px] sm:leading-[19px] font-normal">
                        <del>€19,335</del>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[14px] md:text-[16px] sm:leading-[19px] leading-[17px] font-normal text-black mb-2 md:mb-3"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Jay"
                    className="w-full px-4 border-transparent focus:border-[#017EFE] text-base min-h-[33px] md:min-h-[42px] bg-[#E3E8ED] rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[14px] md:text-[16px] sm:leading-[19px] leading-[17px] font-normal text-black mb-2 md:mb-3"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@mail.com"
                    className="w-full px-4 text-base border-transparent focus:border-[#017EFE] min-h-[33px] md:h-[42px] bg-[#E3E8ED] rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[14px] md:text-[16px] sm:leading-[19px] leading-[17px] font-normal text-black mb-2 md:mb-3"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="(+44) 123 456 7890"
                    className="w-full px-4 text-base border-transparent focus:border-[#017EFE] min-h-[33px] md:h-[42px] bg-[#E3E8ED] rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="mt-6 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-[14px] md:text-[16px] sm:leading-[19px] leading-[17px] font-normal text-black mb-2 md:mb-3"
                  >
                    Offer your price
                  </label>
                  <div className="relative">
                    <div className="group">
                      <div className="absolute top-[6px] md:top-[9px] left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-[#828282] text-[18px] !leading-[22px] group-hover:text-black mt-0.5">
                          £
                        </span>
                      </div>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        className="w-full px-4 pl-7 text-base border-transparent focus:border-[#017EFE] min-h-[36px] md:h-[42px] bg-[#E3E8ED] rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300 "
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-6 md:mt-12 text-base font-medium w-full bg-[#017EFE] hover:bg-[#003D7B] transition-all duration-300 text-white h-[35px] md:h-[40px] px-4 rounded-[60px]"
              >
                Submit
              </button>

              {/* Checkboxes */}
              <div className="mt-6 max-w-[486px] space-y-2 sm:space-y-3">
                <Checkbox title="I have read and agree to the rules of Delivery and Payment, Returns and Exchanges" />
                <Checkbox title="Call me to confirm an order" />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchInfo;
