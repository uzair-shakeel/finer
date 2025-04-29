"use client";
import Cross from "../SvgIcons/Cross";
import Right from "../SvgIcons/Right";
import { useTranslation } from "react-i18next";
import { scrollToHomeFormSection } from "../utils/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

const NewArrivals = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch only live and featured products
        const response = await fetch("/api/products?status=live&featured=true");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Fetch products error:", error);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyClick = (product) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("buyFormProduct");
      sessionStorage.removeItem("buyFormData");
    }

    const prefillText = `Item: ${product.brand} ${product.model}\nBrand: ${
      product.brand || "N/A"
    }\nModel: ${product.model || "N/A"}\nReference: ${
      product.reference || "N/A"
    }\nYear: ${product.year || "N/A"}\nCondition: ${
      product.condition || "N/A"
    }\nPrice: £${product.price}`;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("buyFormProduct", JSON.stringify(product));
      sessionStorage.setItem("buyFormData", prefillText);

      sessionStorage.setItem("setActiveHomeTab", "buy");
    }

    scrollToHomeFormSection("buy");
  };

  if (loading) {
    return (
      <div className="px-[9px] sm:px-5">
        <div className="mt-[24px] md:mt-[48px] w-full max-w-[1296px] mx-auto">
          <h2 className="pl-[11px] sm:pl-0 text-[22px] md:text-[36px] font-semibold !leading-[34px] mb-3 md:mb-6">
            {t("newArrivals.title")}
          </h2>
          <div className="flex justify-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-[9px] sm:px-5">
        <div className="mt-[24px] md:mt-[48px] w-full max-w-[1296px] mx-auto">
          <h2 className="pl-[11px] sm:pl-0 text-[22px] md:text-[36px] font-semibold !leading-[34px] mb-3 md:mb-6">
            {t("newArrivals.title")}
          </h2>
          <div className="text-center text-red-500 py-4">{error}</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-[9px] sm:px-5">
        <div className="mt-[24px] md:mt-[48px] w-full max-w-[1296px] mx-auto">
          <h2 className="pl-[11px] sm:pl-0 text-[22px] md:text-[36px] font-semibold !leading-[34px] mb-3 md:mb-6">
            {t("newArrivals.title")}
          </h2>
          <div className="text-center py-4">No products available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[9px] sm:px-5">
      <div className="mt-[24px] md:mt-[48px] w-full max-w-[1296px] mx-auto">
        <h2 className="pl-[11px] sm:pl-0 text-[22px] md:text-[36px] font-semibold !leading-[34px] mb-3 md:mb-6">
          {t("newArrivals.title")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {products.map((product) => (
            <Link
              href={`/single-product/${product._id}`}
              key={product._id}
              className="block"
            >
              <div className="bg-white rounded-[24px] sm:rounded-[30px] p-[12px] sm:p-[18px] w-full  transition-shadow duration-300">
                <div className="w-full h-[168px] sm:h-[248px] overflow-hidden rounded-[20px] relative flex items-center justify-center group">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={`${product.brand} ${product.model}`}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,..."
                    width={204}
                    height={248}
                    draggable="false"
                    loading="lazy"
                    className="w-full h-full !object-cover rounded-[20px] !aspect-square opacity-100 group-hover:scale-105 duration-300 absolute top-0 left-0"
                    sizes="(max-width: 640px) 100vw, 204px"
                  />

                  {product.discount > 0 && (
                    <div className="bg-[#60FF7D] rounded-lg sm:rounded-[13px] p-2 sm:py-[10px] px-[9px] absolute w-fit top-0 left-0">
                      <h2 className="text-black text-xs sm:text-[14px] leading-[17px] font-normal">
                        -{product.discount}%
                      </h2>
                    </div>
                  )}
                </div>

                <div className="mt-[12px] space-y-1.5 sm:space-y-3">
                  <h3 className="text-black font-normal !leading-[9px] sm:!leading-[12px] text-xs sm:text-[16px]">
                    {product.brand}
                  </h3>
                  <h2 className="text-black font-semibold !leading-[10px] sm:!leading-[15px] text-[14px] sm:text-[20px]">
                    {product.model}
                  </h2>
                  <p className="text-black text-xs !leading-[9px] sm:!leading-[12px] font-normal sm:text-[16px]">
                    {product.reference}
                  </p>
                </div>

                <div className="w-fit bg-[#ECF0F3] p-[8px] sm:p-[9px] rounded-xl mt-3">
                  <h3 className="text-[#000000] text-[10px] sm:text-[14px] font-normal !leading-[7px] sm:!leading-[10px]">
                    {t("newArrivals.year")} {product.year}
                  </h3>
                  <div className="mt-[8px] sm:mt-[12px] flex items-center gap-3">
                    <h3 className="flex items-center gap-2 text-black text-[10px] sm:text-[14px] sm:!leading-[10px] !leading-[7px]">
                      {t("newArrivals.box")}{" "}
                      {product.condition &&
                      (typeof product.condition === "object"
                        ? product.condition.hasBox
                        : product.condition.includes("Box")) ? (
                        <Right />
                      ) : (
                        <Cross />
                      )}
                    </h3>
                    <h3 className="flex items-center gap-2 text-black text-[10px] sm:text-[14px] sm:!leading-[10px] !leading-[7px]">
                      {t("newArrivals.papers")}{" "}
                      {product.condition &&
                      (typeof product.condition === "object"
                        ? product.condition.hasPapers
                        : product.condition.includes("Papers")) ? (
                        <Right />
                      ) : (
                        <Cross />
                      )}
                    </h3>
                  </div>
                </div>

                <div className="mb-[11px] mt-[8px] sm:my-[12px] flex items-center justify-start gap-2 sm:gap-[18px]">
                  <h3
                    className={`text-[16px] sm:text-[24px] sm:!leading-[29px] !leading-[19px] font-semibold ${
                      product.discount > 0 ? "text-[#017EFE]" : "text-black"
                    }`}
                  >
                    £{product.price}
                  </h3>
                  {product.discount > 0 && (
                    <del className="text-[#828282] text-xs sm:text-[16px] sm:!leading-[19px] leading-none font-normal">
                      £{product.originalPrice}
                    </del>
                  )}
                </div>
                {/* <div className="flex items-center justify-start">
                  <button
                    onClick={() => handleBuyClick(product)}
                    className="bg-[#017EFE] hover:bg-[#003D7B] transition-all duration-300 h-[35px] sm:h-[39px] rounded-[60px] flex items-center justify-center px-10 text-white font-medium text-[12px] sm:text-[16px] sm:!leading-[19px] leading-[100%] w-fit"
                  >
                    {t("newArrivals.buy")}
                  </button>
                </div> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
