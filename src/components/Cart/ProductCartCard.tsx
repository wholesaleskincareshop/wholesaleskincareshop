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

  const basePrice =
  product.oldPrice && product.quantity > 6
    ? product.oldPrice
      : product.currentPrice;
  
      const displayPrice =
        selectedCurrency === "USD" && exchangeRate > 0
          ? basePrice / exchangeRate
          : basePrice;

  const currencySymbol = selectedCurrency === "USD" ? "$" : "₦";

  const formattedPrice =
    selectedCurrency === "USD" && typeof displayPrice === "number"
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
                onClick={() => {
                  if (product.quantity > 1) {
                    onQuantityChange(product.id, -1);
                  }
                }}
                className={`text-gray-500 ${
                  product.quantity <= 1 ? "opacity-40 cursor-not-allowed" : ""
                }`}
                disabled={product.quantity <= 1}
              >
                -
              </button>
              <p>{product.quantity}</p>
              <button
                onClick={() => {
                  if (product.quantity < product.availableAmount) {
                    onQuantityChange(product.id, 1);
                  }
                }}
                className={`text-gray-500 ${
                  product.quantity >= product.availableAmount
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
                disabled={product.quantity >= product.availableAmount}
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
