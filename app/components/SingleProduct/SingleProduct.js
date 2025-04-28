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

const SingleProduct = ({ product }) => {
  const coverImage = product?.imageUrl || "/placeholder.svg";
  const productImages = [
    product?.imageUrl || "/placeholder.svg",
    product?.backsideImageUrl || product?.imageUrl || "/placeholder.svg",
    ...(product?.additionalImages || []).map(
      (img) => img.url || "/placeholder.svg"
    ),
  ];
  console.log(productImages);

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
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Model:</span>{" "}
                    {product?.model}
                    {product?.extra && (
                      <span className="ml-2 text-[#017EFE]">
                        "{product.extra}"
                      </span>
                    )}
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
                    {product?.condition?.overall || "N/A"}
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
                    {product?.bracelet || "N/A"}
                    {product?.braceletLength && (
                      <span> ({product.braceletLength})</span>
                    )}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Movement:</span>{" "}
                    {product?.movement || "N/A"}
                  </h2>
                  <h2 className="text-[14px] sm:text-[16px] font-normal text-black leading-[17px] sm:leading-[19px]">
                    <span className="font-semibold">Water Resistance:</span>{" "}
                    {product?.waterResistance ? "Yes" : "No"}
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
