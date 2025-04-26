"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ImageUploader from "../ImageUploader";
import Checkbox from "../Checkbox";
import ConditionsModal from "./ConditionsModal";
import { useTranslation } from "react-i18next";

export default function SellTab() {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [checkedItems, setCheckedItems] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    phone: false,
    item: false,
    condition: false,
    price: false,
  });

  const [formatErrors, setFormatErrors] = useState({
    name: false,
    email: false,
    phone: false,
    price: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleCheckboxChange = (key) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleImagesChange = (files) => {
    setUploadedImages(files);
  };

  const validateInput = (field, value) => {
    const newFormatErrors = { ...formatErrors };

    switch (field) {
      case "name":
        // Check if name contains any digits
        newFormatErrors.name = /\d/.test(value);
        break;
      case "email":
        // Basic email validation
        newFormatErrors.email =
          value.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case "phone":
        // Check if phone contains any letters
        newFormatErrors.phone = /[a-zA-Z]/.test(value);
        break;
      case "price":
        // Validate price is a positive number
        newFormatErrors.price =
          value && (isNaN(parseFloat(value)) || parseFloat(value) <= 0);
        break;
      default:
        break;
    }

    setFormatErrors(newFormatErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
  };

  const validateForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const errors = {
      name: !form.name.value.trim(),
      email: !form.email.value.trim(),
      phone: !form.phone.value.trim(),
      item: !form.item.value.trim(),
      condition: !form.condition.value.trim(),
      price: !form.price.value.trim(),
    };

    setFormErrors(errors);

    // Validate format for all fields before submission
    validateInput("name", form.name.value);
    validateInput("email", form.email.value);
    validateInput("phone", form.phone.value);
    validateInput("price", form.price.value);

    if (
      Object.values(errors).some(Boolean) ||
      Object.values(formatErrors).some(Boolean)
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name.value);
      formData.append("email", form.email.value);
      formData.append("phone", form.phone.value);
      formData.append("item", form.item.value);
      formData.append("condition", form.condition.value);
      formData.append("price", form.price.value);
      formData.append("formType", "Sell");

      formData.append("telephone", checkedItems.checkbox1);
      formData.append("sms", checkedItems.checkbox2);
      formData.append("emailContact", checkedItems.checkbox3);
      formData.append("whatsapp", checkedItems.checkbox4);

      if (uploadedImages.length > 0) {
        uploadedImages.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await fetch("/api/submit-form", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        form.reset();
        setCheckedItems({
          checkbox1: false,
          checkbox2: false,
          checkbox3: false,
          checkbox4: false,
        });
        setFormatErrors({
          name: false,
          email: false,
          phone: false,
          price: false,
        });
        setUploadedImages([]);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className="flex items-start justify-between lg:flex-row flex-col gap-6 pt-6 md:pt-12 md:px-4">
      <div className="space-y-3 md:space-y-4 w-full lg:max-w-[482px] px-2">
        <h1 className="md:block hidden text-[24px] md:text-4xl leading-[95%] font-semibold md:text-left text-center">
          {t("tab.titleSellOne")}
        </h1>
        <p className="md:block hidden md:pb-8 text-black text-sm md:text-base font-normal leading-[20px] md:text-left text-center">
          {t("tab.descSellOne")}
        </p>
        <h1 className="block md:hidden text-[24px] md:text-4xl leading-[95%] font-semibold md:text-left text-center">
          {t("tab.titleSellTwo")}
        </h1>
        <p className="block md:hidden md:pb-8 text-black text-sm md:text-base font-normal leading-[20px] md:text-left text-center">
          {t("tab.descSellTwo")}
        </p>
        <div className="w-full hidden md:flex items-center justify-center md:items-start md:justify-start">
          <Image
            src="/assets/selltab.svg"
            alt="selltab"
            width={274}
            height={271}
            className="md:w-[274px] md:h-[271px] w-[80px] h-[80px]"
          />
        </div>
      </div>

      <form
        onSubmit={validateForm}
        className="space-y-2.5 md:space-y-6 min-w-full lg:min-w-[500px] xl:min-w-[636px]"
      >
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm md:text-base font-normal text-black mb-2 md:mb-3"
            >
              {t("form.name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={t("form.namePlaceholder")}
              onChange={handleInputChange}
              className={`w-full px-4 text-base min-h-[33px] md:min-h-[42px] bg-[#E3E8ED] rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300 
                                   ${formErrors.name || formatErrors.name
                  ? "border-[#B80000]"
                  : "border-transparent focus:border-[#017EFE]"
                }`}
            />
            {formErrors.name && (
              <p className="text-[#B80000] text-sm mt-1">
                {t("form.mandatoryField")}
              </p>
            )}
            {formatErrors.name && (
              <p className="text-[#B80000] text-sm mt-1">
                {t("form.nameContainNumbers")}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm md:text-base font-normal text-black mb-2 md:mb-3"
            >
              {t("form.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@mail.com"
              onChange={handleInputChange}
              className={`w-full px-4 text-base min-h-[33px] md:h-[42px] bg-[#E3E8ED] rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300 
                                   ${formErrors.email || formatErrors.email
                  ? "border-[#B80000]"
                  : "border-transparent focus:border-[#017EFE]"
                }`}
            />
            {formErrors.email && (
              <p className="text-[#B80000] text-sm mt-1">
                {t("form.mandatoryField")}
              </p>
            )}
            {formatErrors.email && (
              <p className="text-[#B80000] text-sm mt-1">
                {t("form.emailAddress")}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm md:text-base font-normal text-black mb-2 md:mb-3"
            >
              {t("form.phone")}
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="(+44) 123 456 7890"
              onChange={handleInputChange}
              className={`w-full px-4 text-base min-h-[33px] md:h-[42px] bg-[#E3E8ED] rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300 
                              ${formErrors.phone || formatErrors.phone
                  ? "border-[#B80000]"
                  : "border-transparent focus:border-[#017EFE]"
                }`}
            />
            {formErrors.phone && (
              <p className="text-[#B80000] text-sm mt-1">
                {t("form.mandatoryField")}
              </p>
            )}
            {formatErrors.phone && (
              <p className="text-[#B80000] text-sm mt-1">
                {t("form.phoneNumberContainNumbers")}
              </p>
            )}
          </div>
        </div>

        {/* Condition & Item */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 pt-4 md:pt-6">
          <div>
            <label
              htmlFor="item"
              className="block text-sm md:text-base font-normal text-black mb-2 md:mb-3"
            >
              {t("form.item")}
            </label>
            <div className="relative">
              <select
                id="item"
                name="item"
                className={`w-full px-4 text-base min-h-[33px] md:h-[42px] bg-[#E3E8ED] appearance-none rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300 
                                        ${formErrors.item
                    ? "border-[#B80000]"
                    : "border-transparent focus:border-[#017EFE]"
                  }`}
                defaultValue="Watch"
                disabled={isModalOpen}
              >
                <option>{t("form.itemOptions.watch")}</option>
                <option>{t("form.itemOptions.jewellery")}</option>
                <option>{t("form.itemOptions.other")}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  width="15"
                  height="16"
                  viewBox="0 0 15 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L7.5 12L14 4"
                    stroke="#828282"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {formErrors.item && (
              <p className="text-[#B80000] text-sm mt-1">
                {t("form.mandatoryField")}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="condition"
              className="flex items-center gap-1 text-sm md:text-base font-normal text-black mb-2 md:mb-3"
            >
              {t("form.condition")}
              <div>
                <div
                  className="ml-1 text-gray-400 cursor-pointer"
                  onClick={openModal}
                >
                  <Image
                    src="/assets/conditions.svg"
                    alt="conditions"
                    width={16}
                    height={16}
                  />
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div
                      ref={modalRef}
                      className="bg-white rounded-[20px] p-6 max-w-xl w-full min-h-[85vh] max-h-[85vh] overflow-y-auto scrollbar-hide"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold"> {t("modal.title")}</h2>
                        <button
                          onClick={closeModal}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18M6 6L18 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <ConditionsModal />
                    </div>
                  </div>
                )}
              </div>
            </label>
            <div className="relative">
              <select
                id="condition"
                name="condition"
                className={`w-full px-4 text-base min-h-[33px] md:h-[42px] bg-[#E3E8ED] appearance-none rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300 
                                                      ${formErrors.condition
                    ? "border-[#B80000]"
                    : "border-transparent focus:border-[#017EFE]"
                  }`}
                defaultValue="Good"
                disabled={isModalOpen}
              >
                <option>{t("form.conditionOption.new")}</option>
                <option>{t("form.conditionOption.unworn")}</option>
                <option>{t("form.conditionOption.veryGood")}</option>
                <option>{t("form.conditionOption.good")}</option>
                <option>{t("form.conditionOption.fair")}</option>
                <option>{t("form.conditionOption.incomplete")}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  width="15"
                  height="16"
                  viewBox="0 0 15 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L7.5 12L14 4"
                    stroke="#828282"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {formErrors.condition && (
              <p className="text-[#B80000] text-sm mt-1">
                {t("form.mandatoryField")}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm md:text-base font-normal text-black mb-2 md:mb-3"
            >
              {t("form.price")}
            </label>
            <div className="relative">
              <div className=" group">
                <div className="absolute top-[6px] md:top-[9px] left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#828282] text-[18px] !leading-[22px] group-hover:text-black mt-0.5">
                    £
                  </span>
                </div>
                <input
                  type="text"
                  id="price"
                  name="price"
                  onChange={handleInputChange}
                  className={`w-full px-4 pl-7 text-base min-h-[36px] md:h-[42px] bg-[#E3E8ED] rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300 
                                   ${formErrors.price || formatErrors.price
                      ? "border-[#B80000] "
                      : "border-transparent focus:border-[#017EFE] group-hover:border-[#017EFE]"
                    }`}
                  disabled={isModalOpen}
                />
              </div>
              {formErrors.price && (
                <p className="text-[#B80000] text-sm mt-1">
                  {t("form.mandatoryField")}
                </p>
              )}
              {formatErrors.price && (
                <p className="text-[#B80000] text-sm mt-1">
                  {t("form.positiveNumber")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="pt-[14px] md:pt-6">
          <ImageUploader
            disabled={isModalOpen}
            onImagesChange={handleImagesChange}
          />
        </div>

        {/* Status message */}
        {submitStatus === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {t("form.submittedSuccessfully")}
          </div>
        )}
        {submitStatus === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {t("form.errorSubmitting")}
          </div>
        )}

        {/* Social Media */}
        <div className="pt-[14px] md:pt-6 pb-[14px] md:pb-0">
          <p className="text-sm md:text-base font-normal text-black mb-3">
            {t("form.contactedBy")}
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <label className="inline-flex items-center">
              <Checkbox
                title={t("contactMethods.telephone")}
                checked={checkedItems.checkbox1}
                onChange={() => handleCheckboxChange("checkbox1")}
                disabled={isModalOpen}
              />
            </label>
            <label className="inline-flex items-center">
              <Checkbox
                title={t("contactMethods.sms")}
                checked={checkedItems.checkbox2}
                onChange={() => handleCheckboxChange("checkbox2")}
                disabled={isModalOpen}
              />
            </label>
            <label className="inline-flex items-center">
              <Checkbox
                title={t("contactMethods.email")}
                checked={checkedItems.checkbox3}
                onChange={() => handleCheckboxChange("checkbox3")}
                disabled={isModalOpen}
              />
            </label>
            <label className="inline-flex items-center">
              <Checkbox
                title={t("contactMethods.whatsapp")}
                checked={checkedItems.checkbox4}
                onChange={() => handleCheckboxChange("checkbox4")}
                disabled={isModalOpen}
              />
            </label>
          </div>
        </div>

        {/* button */}
        <button
          type="submit"
          className="text-base font-medium w-full bg-[#017EFE] hover:bg-[#003D7B] transition-all duration-300 text-white h-[35px] md:h-[40px] px-4 rounded-[60px]"
          disabled={isModalOpen || isSubmitting}
        >
          {isSubmitting ? t("form.submitting") : t("form.submit")}
        </button>
      </form>
    </div>
  );
}
