"use client";
import Cross from "../SvgIcons/Cross";
import Right from "../SvgIcons/Right";
import { useTranslation } from "react-i18next";
import { scrollToHomeFormSection } from "../utils/navigation";
import Image from "next/image";
import { useState, useEffect, memo, useCallback } from "react";
import Link from "next/link";

const ProductCardSkeleton = memo(() => (
  <div className="bg-white rounded-[24px] sm:rounded-[30px] p-[12px] sm:p-[18px] w-full">
    <div className="w-full h-[168px] sm:h-[248px] rounded-[20px] relative bg-gray-200 animate-pulse"></div>

    <div className="mt-[12px] space-y-1.5 sm:space-y-3">
      <div className="h-[9px] sm:h-[12px] w-1/2 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-[15px] sm:h-[20px] w-3/4 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-[9px] sm:h-[12px] w-1/3 bg-gray-200 animate-pulse rounded"></div>
    </div>

    <div className="w-fit bg-gray-100 p-[8px] sm:p-[9px] rounded-xl mt-3">
      <div className="h-[7px] sm:h-[10px] w-[50px] sm:w-[80px] bg-gray-200 animate-pulse rounded"></div>
      <div className="mt-[8px] sm:mt-[12px] flex items-center gap-3">
        <div className="h-[7px] sm:h-[10px] w-[60px] sm:w-[90px] bg-gray-200 animate-pulse rounded"></div>
        <div className="h-[7px] sm:h-[10px] w-[60px] sm:w-[90px] bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>

    <div className="my-[12px] flex items-center gap-2 sm:gap-[18px]">
      <div className="h-[19px] sm:h-[29px] w-[80px] sm:w-[120px] bg-gray-200 animate-pulse rounded"></div>
    </div>
  </div>
));
ProductCardSkeleton.displayName = "ProductCardSkeleton";

const ProductsGridSkeleton = memo(() => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
    {Array.from({ length: 10 }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
));
ProductsGridSkeleton.displayName = "ProductsGridSkeleton";

const ProductCard = memo(({ product, formatPrice, t }) => {
  const isSoldOut = product.status === "sold_out";

  return (
    <Link href={`/single-product/${product._id}`} className="block">
      <div className="bg-white rounded-[24px] sm:rounded-[30px] p-[12px] sm:p-[18px] w-full transition-shadow duration-300">
        <div className="w-full h-[168px] sm:h-[248px] overflow-hidden rounded-[20px] relative flex items-center justify-center group">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={`${product.brand} ${product.model}`}
            width={204}
            height={248}
            draggable="false"
            loading="lazy"
            className="w-full h-full !object-cover rounded-[20px] !aspect-square opacity-100 group-hover:scale-110 scale-105 duration-300 absolute top-0 left-0"
            sizes="(max-width: 640px) 100vw, 204px"
          />

          {product.discount > 0 && !isSoldOut && (
            <div className="bg-[#60FF7D] rounded-lg sm:rounded-[13px] p-2 sm:py-[10px] px-[9px] absolute w-fit top-0 right-0">
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
          <h2 className="text-black font-semibold !leading-[15px] sm:!leading-[20px] text-[14px] sm:text-[20px]">
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
          {isSoldOut ? (
            <h3 className="text-[#FF0000] text-[16px] sm:text-[24px] font-semibold leading-[19px] sm:leading-[29px]">
              Sold Out
            </h3>
          ) : (
            <>
              <h3
                className={`text-[16px] sm:text-[24px] sm:!leading-[29px] !leading-[19px] font-semibold ${
                  product.discountedPrice > 0 ? "text-[#017EFE]" : "text-black"
                }`}
              >
                {formatPrice(
                  product.discountedPrice > 0
                    ? product.discountedPrice
                    : product.price
                )}
              </h3>
              {product.discount > 0 && (
                <del className="text-[#828282] text-xs sm:text-[16px] sm:!leading-[19px] leading-none font-normal">
                  {formatPrice(product.price)}
                </del>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
});
ProductCard.displayName = "ProductCard";

const NewArrivals = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Format price with memoization
  const formatPrice = useCallback((price) => {
    if (!price || isNaN(price)) return "£0";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch only live and featured products
        const response = await fetch("/api/products?featured=true", {
          signal,
          headers: {
            "Cache-Control": "no-store",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch products error:", error);
          setError("Failed to load products");
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="px-[9px] sm:px-5">
      <div className="mt-[32px] md:mt-[48px] w-full max-w-[1296px] mx-auto">
        <h2 className="pl-[11px] sm:pl-0 text-[22px] md:text-[36px] font-semibold !leading-[34px] mb-3 md:mb-6">
          {t("newArrivals.title")}
        </h2>

        {loading && <ProductsGridSkeleton />}

        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-4">No products available</div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                formatPrice={formatPrice}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(NewArrivals);
