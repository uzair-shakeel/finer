"use client";
import ReturnArrow from "@/app/SvgIcons/ReturnArrow";
import Link from "next/link";
import ImageSlider from "./ImageSlider";
import WatchInfo from "./WatchInfo";
import FastDelivery from "@/app/SvgIcons/FastDelivery";
import Returns from "@/app/SvgIcons/Returns";
import AuthenticityGuarantee from "@/app/SvgIcons/AuthenticityGuarantee";
import Description from "./Description";
import RecentlyViewed from "./RecentlyViewed";
import Coins from "@/app/SvgIcons/Coins";

const SingleProduct = ({ product }) => {
  const coverImage = product?.imageUrl || "/placeholder.svg";

  // Check if product is sold out
  const isSoldOut = product?.status === "sold_out";

  // Process additional images properly
  let additionalImageUrls = [];
  if (product?.additionalImages && Array.isArray(product.additionalImages)) {
    // Clone the array to avoid mutating the original
    additionalImageUrls = [...product.additionalImages]
      // Ensure each item has an order property, default to 0 if missing
      .map((img) => ({
        ...img,
        order: img.order !== undefined ? img.order : 0,
      }))
      // Sort by order
      .sort((a, b) => a.order - b.order)
      // Extract the URLs
      .map((img) => img.url);
  }

  // Extract bracelet name without brand info
  const formatBraceletName = (braceletValue) => {
    if (!braceletValue) return "N/A";

    // Check if the bracelet value has a brand in parentheses
    const parenthesisIndex = braceletValue.indexOf(" (");
    if (parenthesisIndex > 0) {
      // Return just the part before the parenthesis
      return braceletValue.substring(0, parenthesisIndex);
    }

    return braceletValue;
  };

  // Combine all images in the right order
  const productImages = [
    product?.imageUrl || "/placeholder.svg",
    ...(product?.backsideImageUrl ? [product.backsideImageUrl] : []),
    ...additionalImageUrls,
  ].filter(Boolean); // Filter out any undefined or null values

  // Function to format water resistance information
  const formatWaterResistance = () => {
    if (!product?.waterResistance) return "No";

    let result = "Yes";

    // Add depth information if available
    if (product.depth) {
      // If depth is "Other" and we have a custom depth, use that
      if (product.depth === "Other" && product.depthCustom) {
        result += ` (${product.depthCustom})`;
      }
      // Otherwise show the depth value
      else if (product.depth !== "Not specified") {
        result += ` (${product.depth})`;
      }
    }

    return result;
  };

  return (
    <div className="px-5 pt-[85px] sm:pt-[110px]">
      <div className="max-w-[1296px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center flex-wrap gap-2 md:gap-6 mb-6 md:mb-12">
          <Link href="/" className="flex items-center gap-2">
            <ReturnArrow />{" "}
            <h2 className="text-[#000000] text-[14px] sm:text-[16px] font-normal leading-[12px]">
              Return to search
            </h2>
          </Link>
          <div className="flex items-center gap-2">
            <h2 className="text-[#828282] text-[12px] sm:text-[14px] leading-[10px] font-normal">
              Watches / Limited collections / {product?.reference}
            </h2>
          </div>
        </div>

        {/* Details */}
        <div className="w-full flex lg:flex-row flex-col items-start gap-3 md:gap-6">
          {/* Left Side */}
          <div className="w-full">
            <div className="w-full">
              <ImageSlider images={productImages} coverImage={coverImage} />
            </div>
            {/* Description */}
            <div className="lg:block hidden">
              <Description product={product} />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full">
            <WatchInfo product={product} />
            {/* Rules */}
            <div className="mt-3 md:mt-6 bg-white rounded-[20px] p-6 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <FastDelivery />
                <h2 className="text-[14px] sm:text-[16px] font-normal leading-[17px] sm:leading-[19px] text-black">
                  <span className="font-semibold">Fast delivery</span> in{" "}
                  <span className="font-semibold">1-2</span> business days
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Returns />
                <h2 className="text-[14px] sm:text-[16px] font-normal leading-[17px] sm:leading-[19px] text-black">
                  <span className="font-semibold">14 day returns</span> for your
                  convenience
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <AuthenticityGuarantee />
                <h2 className="text-[14px] sm:text-[16px] font-normal leading-[17px] sm:leading-[19px] text-black">
                  <span className="font-semibold">Authenticity guarantee</span>{" "}
                  for all items
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Coins />
                <h2 className="text-[14px] sm:text-[16px] font-normal leading-[17px] sm:leading-[19px] text-black">
                  <span className="font-semibold">A deposit for 2%</span> of the
                  watch price is required{" "}
                  <span className="font-semibold">to serve</span> this watch
                </h2>
              </div>
            </div>

            {/* Details */}
            <div className="mt-3 md:mt-6 bg-white rounded-[20px] p-6">
              <h3 className="text-[18px] sm:text-[24px] font-semibold leading-[17px] sm:leading-[23px] text-black">
                Details
              </h3>
              <div className="mt-3 sm:mt-6 flex md:flex-row flex-col items-start gap-2 md:gap-12">
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Brand:</span>{" "}
                    {product?.brand}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] max-w-[250px] sm:leading-[19px]">
                    <span className="font-semibold">Model:</span>{" "}
                    {product?.model}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Reference:</span>{" "}
                    {product?.reference}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Year:</span> {product?.year}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Box:</span>{" "}
                    {product?.condition?.hasBox ? "Yes" : "No"}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Papers:</span>{" "}
                    {product?.condition?.hasPapers ? "Yes" : "No"}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Condition:</span>{" "}
                    {product?.condition?.status || "N/A"}
                  </h2>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Item Code:</span>{" "}
                    {product?.itemCode || "N/A"}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Case Size:</span>{" "}
                    {product?.caseSize || "N/A"}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Case Material:</span>{" "}
                    {product?.caseMaterial || "N/A"}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Dial Colour:</span>{" "}
                    {product?.dialColour || "N/A"}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Bracelet:</span>{" "}
                    {formatBraceletName(product?.bracelet) || "N/A"}
                    {product?.braceletLength && (
                      <span> (length {product.braceletLength})</span>
                    )}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Movement:</span>{" "}
                    {product?.movement || "N/A"}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Water Resistance:</span>{" "}
                    {formatWaterResistance()}
                  </h2>
                </div>
              </div>
            </div>

            <div className="block lg:hidden">
              <Description product={product} />
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <RecentlyViewed currentProductId={product?._id} />
      </div>
    </div>
  );
};

export default SingleProduct;
