import Image from "next/image";
import { navigateToBuyForm } from '../utils/navigation';

const ProductCard = ({ product }) => {
  const handleBuyClick = () => {
    navigateToBuyForm(
      product.name, 
      `Brand: ${product.brand || 'N/A'}\nModel: ${product.model || 'N/A'}\nCondition: ${product.condition || 'N/A'}${product.description ? `\nDescription: ${product.description}` : ''}`, 
      product.price
    );
  };

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden">
      {product.image && (
        <div className="relative h-48 w-full">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {product.description && <p className="text-gray-600 mt-2">{product.description}</p>}
        <p className="mt-2 text-xl font-bold">£{product.price}</p>
        <button 
          onClick={handleBuyClick}
          className="mt-4 text-base font-medium w-full bg-[#017EFE] hover:bg-[#003D7B] transition-all duration-300 text-white h-[35px] md:h-[40px] px-4 rounded-[60px]"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 