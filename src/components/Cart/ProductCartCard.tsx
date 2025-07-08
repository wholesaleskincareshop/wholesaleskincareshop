import React from "react";
import { Paragraph1, ParagraphLink2 } from "../Text";
import { useExchangeRateStore } from "@/stores/exchangeRateStore";


type ProductCartCardProps = {
  product: any;
  onRemove: any;
  onQuantityChange: any;
};

const ProductCartCard: React.FC<ProductCartCardProps> = ({
  product,
  onRemove,
  onQuantityChange,
}) => {
  const { selectedCurrency, exchangeRate } = useExchangeRateStore();

  const displayPrice =
    selectedCurrency === "USD" && exchangeRate > 0
      ? product.currentPrice / exchangeRate // Convert to USD
      : product.currentPrice; // Default to NGN

  const currencySymbol = selectedCurrency === "USD" ? "$" : "₦";

  const formattedPrice =
    selectedCurrency === "USD"
      ? displayPrice.toFixed(2) // Format for USD with 2 decimal places
      : displayPrice; // Format for NGN (comma-separated)

  return (
    <div className="flex relative justify-between items-start bg-white p-2 px-3 rounded-lg">
      <div className="flex gap-2 items-center">
        <img
          src={product.productImageURL1.replace(
            "/upload/",
            "/upload/w_100,f_auto/"
          )}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div className=" space-y-2">
          <ParagraphLink2 className="font-bold truncate overflow-hidden whitespace-nowrap w-[150px]">
            {product.name}
          </ParagraphLink2>
          <div className="flex gap-4 items-center ">
            <Paragraph1 className="text-gray-500">Qt:</Paragraph1>
            <div className="flex gap-4 items-center justify-between border rounded-lg px-4">
              <button
                onClick={() => onQuantityChange(product.id, -1)}
                className="text-gray-500"
              >
                -
              </button>
              <p>{product.quantity}</p>
              <button
                onClick={() => onQuantityChange(product.id, 1)}
                className="text-gray-500"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Paragraph1 className="font-bold whitespace-nowrap">
          {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
            Number(formattedPrice * product.quantity)
          )}`}
        </Paragraph1>
        <button
          onClick={() => onRemove(product.id)}
          className="absolute right-4 bottom-4 text-[12px] text-gray-500"
        >
          &#x2715;
        </button>
      </div>
    </div>
  );
};

export default ProductCartCard;
