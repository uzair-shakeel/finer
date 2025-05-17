"use client";

import Cross from "@/app/SvgIcons/Cross";
import Right from "@/app/SvgIcons/Right";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product, formatPrice, t }) => {
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
                              Year {product.year}
                         </h3>
                         <div className="mt-[8px] sm:mt-[12px] flex items-center gap-3">
                              <h3 className="flex items-center gap-2 text-black text-[10px] sm:text-[14px] sm:!leading-[10px] !leading-[7px]">
                                   Box{" "}
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
                                   Papers{" "}
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
                                        className={`text-[16px] sm:text-[24px] sm:!leading-[29px] !leading-[19px] font-semibold ${product.discountedPrice > 0 ? "text-[#017EFE]" : "text-black"
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
};

ProductCard.displayName = "ProductCard";

export default ProductCard;