"use client";
import Image from "next/image";
import { useState, useEffect, useRef, forwardRef } from "react";
import Checkbox from "../Checkbox";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";

const BuyTab = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const searchParams = useSearchParams();
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
    description: false,
  });
  const [formatErrors, setFormatErrors] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const updateDescriptionField = (text) => {
    const descriptionField = document.getElementById("description");
    if (descriptionField) {
      descriptionField.value = text || "";
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateDescriptionField("");

      const formData = sessionStorage.getItem("buyFormData");
      if (formData) {
        updateDescriptionField(`Hello, I'm interested in\n${formData}`);

        sessionStorage.removeItem("buyFormData");
        sessionStorage.removeItem("buyFormProduct");
        return;
      }
    }

    const item = searchParams.get("item");
    const details = searchParams.get("details");
    const price = searchParams.get("price");

    if (item || details || price) {
      let prefillText = "Hello, I'm interested in\n";

      if (item) {
        prefillText += `Item: ${item}\n`;
      }

      if (details) {
        prefillText += `${details}\n`;
      }

      if (price) {
        prefillText += `Price: £${price}\n`;
      }

      updateDescriptionField(prefillText.trim());
    }
  }, [searchParams]);

  useEffect(() => {
    const checkForProductData = () => {
      if (typeof window !== "undefined") {
        const formData = sessionStorage.getItem("buyFormData");
        if (formData) {
          updateDescriptionField(`Hello, I'm interested in\n${formData}`);

          sessionStorage.removeItem("buyFormData");
          sessionStorage.removeItem("buyFormProduct");
        }
      }
    };

    checkForProductData();

    const interval = setInterval(checkForProductData, 500);

    return () => clearInterval(interval);
  }, []);

  const handleCheckboxChange = (key) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
      description: !form.description.value.trim(),
    };

    setFormErrors(errors);

    // Validate format for all fields before submission
    validateInput("name", form.name.value);
    validateInput("email", form.email.value);
    validateInput("phone", form.phone.value);

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
      formData.append("description", form.description.value);
      formData.append("formType", "Buy");

      formData.append("telephone", checkedItems.checkbox1);
      formData.append("sms", checkedItems.checkbox2);
      formData.append("emailContact", checkedItems.checkbox3);
      formData.append("whatsapp", checkedItems.checkbox4);

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
        });

        const nameField = document.getElementById("name");
        if (nameField) {
          nameField.placeholder = "Full Name";
        }

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("buyFormProduct");
          sessionStorage.removeItem("buyFormData");
        }
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

  return (
    <div className="scroll-mt-[80px] flex items-start justify-between lg:flex-row flex-col gap-6 pt-6 md:pt-12 md:px-4">
      <div className="space-y-3 md:space-y-4 w-full lg:max-w-[482px] px-2">
        <h1 className="md:block hidden text-[24px] md:text-4xl leading-[95%] font-semibold md:text-left text-center">
          {t("tab.titleBuyOne")}
        </h1>
        <h1 className="block md:hidden text-[24px] md:text-4xl leading-[95%] font-semibold md:text-left text-center">
          {t("tab.titleBuyTwo")}
        </h1>
        <p className="md:block hidden md:pb-8 text-black text-sm md:text-base font-normal leading-[20px] md:text-left text-center">
          {t("tab.descBuyOne")}
        </p>
        <p className="block md:hidden md:pb-8 text-black text-sm md:text-base font-normal leading-[20px] md:text-left text-center">
          {t("tab.descBuyTwo")}
        </p>
        <div className="w-full hidden md:flex items-center justify-center md:items-start md:justify-start">
          <Image
            src="/assets/buytab.svg"
            alt="buy"
            width={224}
            height={277}
            className="md:w-[223px] md:h-[277px] w-[80px] h-[80px]"
          />
        </div>
      </div>
      <form
        ref={formRef}
        id="buyForm"
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
        {/* Description */}
        <div className="pt-[14px] md:pt-6">
          <label
            htmlFor="description"
            className="block text-sm md:text-base font-normal text-black mb-2 md:mb-3"
          >
            {t("form.description")}
          </label>
          <textarea
            id="description"
            name="description"
            placeholder={t("form.descriptionplaceholder")}
            className={`w-full px-4 py-2.5 h-[160px] text-base bg-[#E3E8ED] rounded-[20px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300 
                              ${formErrors.description
                ? "border-[#B80000]"
                : "border-transparent focus:border-[#017EFE]"
              }`}
          />
          {formErrors.description && (
            <p className="text-[#B80000] text-sm mt-1">{t("form.mandatoryField")}</p>
          )}
        </div>
        {/* Contact Preferences */}
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
              />
            </label>
            <label className="inline-flex items-center">
              <Checkbox
                title={t("contactMethods.sms")}
                checked={checkedItems.checkbox2}
                onChange={() => handleCheckboxChange("checkbox2")}
              />
            </label>
            <label className="inline-flex items-center">
              <Checkbox
                title={t("contactMethods.email")}
                checked={checkedItems.checkbox3}
                onChange={() => handleCheckboxChange("checkbox3")}
              />
            </label>
            <label className="inline-flex items-center">
              <Checkbox
                title={t("contactMethods.whatsapp")}
                checked={checkedItems.checkbox4}
                onChange={() => handleCheckboxChange("checkbox4")}
              />
            </label>
          </div>
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
        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-base font-medium w-full ${isSubmitting ? "bg-gray-400" : "bg-[#017EFE] hover:bg-[#003D7B]"
            } transition-all duration-300 text-white h-[35px] md:h-[40px] px-4 rounded-[60px] flex items-center justify-center`}
        >
          {isSubmitting ? t("form.submitting") : t("form.submit")}
        </button>
      </form>
    </div>
  );
});

BuyTab.displayName = "BuyTab";
export default BuyTab;
