"use client";

import { useState, useEffect, useCallback } from "react";
import Filters from "./Filters";
import Pagination from "./Pagination";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import MoreFilters from "@/app/SvgIcons/MoreFilters";

const Products = () => {
     const brandOptions = [
          { label: "Rolex", value: "rolex" },
          { label: "Cartier", value: "cartier" },
          { label: "Omega", value: "omega" },
          { label: "Breitling", value: "breitling" },
          { label: "Hublot", value: "hublot" },
          { label: "Audemars Piguet", value: "audemars-piguet" },
          { label: "Patek Philippe", value: "patek-philippe" },
          { label: "Vacheron Constantin", value: "vacheron-constantin" },
          { label: "Jaeger-LeCoultre", value: "jaeger-lecoultre" },
     ];

     const colorOptions = [
          { label: "Black", value: "black", color: "#000000" },
          { label: "Grey", value: "grey", color: "#808080" },
          { label: "White", value: "white", color: "#FFFFFF" },
          { label: "Yellow", value: "yellow", color: "#FFD300" },
          { label: "Blue", value: "blue", color: "#00197C" },
          { label: "Green", value: "green", color: "#228B22" },
          { label: "Brown", value: "brown", color: "#8B4513" },
          { label: "Pink", value: "pink", color: "#FF69B4" },
          { label: "Red", value: "red", color: "#C41E3A" },
          { label: "Orange", value: "orange", color: "#FF7F00" },
          { label: "Salmon", value: "salmon", color: "#FA8072" },
          { label: "Bi-Color", value: "bi-color", color: "linear-gradient(135deg, #CC0000 17.5%, #FDAD00 38.95%, #00FA11 59.38%, #1B1FFF 82.5%)" },
          { label: "Champagne", value: "champagne", color: "linear-gradient(135deg, #F7E7CE 0%, #F1D29B 50%, #FFF8DC 100%)" },
          { label: "Silver", value: "silver", color: "linear-gradient(315deg, #C0C0C0 8.75%, #F4F4F4 50%, #E0E0E0 91.25%)" },
          { label: "Golden", value: "golden", color: "linear-gradient(315deg, #FFD700 17.5%, #FFB84D 50%, #FFEB7F 82.5%)" },
          { label: "Bronze", value: "bronze", color: "linear-gradient(144.9deg, #874F00 15.32%, #D79405 59.01%, #9F5500 96.47%)" },
          { label: "Meteorite", value: "meteorite", color: "linear-gradient(144.9deg, #B0B0B0 15.32%, #8A8A8A 59.01%, #E0E0E0 96.47%)" },
          { label: "Opaline", value: "opaline", color: "linear-gradient(144.9deg, #F4F0EC 15.32%, #E2D7C9 55.89%, #FFFFFF 96.47%)" },
          { label: "Mother-of-Pearl", value: "mother-of-pearl", color: "linear-gradient(144.9deg, #F8F8FF 15.32%, #E0E0E0 55.89%, #EDEDED 96.47%)" },
          { label: "Malachite", value: "malachite", color: "linear-gradient(144.9deg, #4B9F6E 15.32%, #34B14D 55.89%, #2D5A32 96.47%)" },
          { label: "Lapis Lazuli", value: "lapis-lazuli", color: "linear-gradient(144.9deg, #2323D0 15.32%, #000080 55.89%, #0066CC 96.47%)" },
          { label: "Onyx", value: "onyx", color: "linear-gradient(135deg, #0A0A0A 17.5%, #323232 50%, #2F2F2F 82.5%)" },
     ];

     const priceOptions = [{ label: "0€ - 15,350€", value: { min: 0, max: 15350 } }];

     const sizeOptions = [
          { label: "Small(<31mm)", sizes: [24, 25, 26, 27, 28, 29, 30] },
          { label: "Medium(31-39mm)", sizes: [31, 32, 33, 34, 35, 36, 37, 38, 39] },
          { label: "Large(>39mm)", sizes: [40, 41, 42, 43, 44, 45] },
     ];

     const handleBrandSelect = (options) => {
          console.log("Selected Brands:", options.map((opt) => opt.label));
     };

     const handleColorSelect = (option) => {
          console.log("Selected Color:", option.label);
     };

     const handlePriceSelect = (option) => {
          console.log("Selected Price Range:", option.value);
     };

     const handleSizeSelect = (options) => {
          console.log("Selected Sizes:", options.map((opt) => opt.value));
     };

     const { t } = useTranslation();
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
     const [totalItems, setTotalItems] = useState(0);
     const [currentPage, setCurrentPage] = useState(1);
     const [showMoreFilters, setShowMoreFilters] = useState(false);
     const itemsPerPage = 1;

     const formatPrice = useCallback((price) => {
          if (!price || isNaN(price)) return "£0";
          return new Intl.NumberFormat("de-DE", {
               style: "currency",
               currency: "EUR",
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
                    setTotalItems(data.total || data.products.length);
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

     const startIndex = (currentPage - 1) * itemsPerPage;
     const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

     if (loading) return <div className="text-center py-4">Loading...</div>;
     if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

     return (
          <div className="max-w-[1296px] mx-auto w-full mt-[110px]">
               <div className="text-center max-w-[664px] mx-auto w-full">
                    <h1 className="text-[36px] font-semibold leading-[34px] mb-6">Buy Luxury Watches</h1>
                    <p className="text-[16px] leading-[19px] font-normal">
                         Browse our collection of pre-owned luxury watches. Find the one that fits your style. Learn what makes each watch special and choose with confidence.
                    </p>
               </div>

               <div className="mt-6 mb-12 flex flex-wrap gap-3 items-center justify-center max-w-[876px] mx-auto w-full relative">
                    <Filters label="Brands" type="list" options={brandOptions} onSelect={handleBrandSelect} />
                    <Filters label="Collection" type="collection" options={brandOptions} onSelect={handleBrandSelect} />
                    <Filters label="Price" type="range" options={priceOptions} onSelect={handlePriceSelect} />
                    <Filters label="Colour" type="color" options={colorOptions} onSelect={handleColorSelect} />
                    <Filters label="Case Size" type="size" options={sizeOptions} onSelect={handleSizeSelect} />

                    {showMoreFilters && (
                         <>
                              <Filters label="Brands" type="list" options={brandOptions} onSelect={handleBrandSelect} />
                              <Filters label="Brands" type="list" options={brandOptions} onSelect={handleBrandSelect} />
                         </>
                    )}

                    <button
                         onClick={() => setShowMoreFilters(!showMoreFilters)}
                         className="bg-[#FFFFFF] rounded-[30px] h-[37px] w-[172px] flex items-center justify-center gap-2.5"
                    >
                         {showMoreFilters ? "Less Filters" : "More Filters"}
                         <MoreFilters />
                    </button>
               </div>

               <div className="mb-14">
                    <div className="flex justify-between items-center mb-6">
                         <div className="text-base font-normal leading-[19px] text-[#828282]">
                              Result ({totalItems})
                         </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                         {currentItems.map((product) => (
                              <ProductCard key={product._id} product={product} formatPrice={formatPrice} t={t} />
                         ))}
                    </div>

                    <div className="mt-4">
                         <Pagination
                              totalItems={totalItems}
                              itemsPerPage={itemsPerPage}
                              onPageChange={setCurrentPage}
                              currentPage={currentPage}
                         />
                    </div>
               </div>
          </div>
     );
};

export default Products;