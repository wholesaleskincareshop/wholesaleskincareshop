import React, { useState, useEffect } from "react";
import { Header3, Header4, Paragraph1, Paragraph2 } from "@/components/Text";
import { Package, MinusIcon, Plus } from "lucide-react";

interface PackOption {
  label: string;
  multiplier: number;
}
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  currentPrice: number;
  oldPrice?: number;
  availableAmount: any;
  productImageURL1?: string;
  productImageURL2?: string;
  productImageURL3?: string;
  productImageURL4?: string;
  productImageURL5?: string;
  productImages: any;
}
interface QuantitySelectorProps {
  product: Product;
  currencySymbol: string;
  onTotalQuantityChange: (totalQty: number) => void;
}

const packOptions: PackOption[] = [
  { label: "Single", multiplier: 1 },
  { label: "1 Pack", multiplier: 12 },
  { label: "6 Packs", multiplier: 72 },
  { label: "10 Packs", multiplier: 120 },
];

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  product,
  currencySymbol,
  onTotalQuantityChange,
}) => {
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const selectedPack = packOptions[selectedPackIndex];
  const totalQuantity = quantity * selectedPack.multiplier;

  const unitPrice =
    totalQuantity > 6 && product.oldPrice
      ? product.oldPrice
      : product.currentPrice;


  const totalPrice = unitPrice * totalQuantity;

  useEffect(() => {
    onTotalQuantityChange(totalQuantity);
  }, [totalQuantity, onTotalQuantityChange]);

  return (
    <div>
      <Header4>How Many?</Header4>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2">
        {packOptions.map((option, index) => {
          const isDisabled = option.multiplier > product.availableAmount;

          return (
            <button
              key={option.label}
              onClick={() => {
                if (!isDisabled) setSelectedPackIndex(index);
              }}
              className={`${
                selectedPackIndex === index && !isDisabled
                  ? "bg-[#e6f9fb] border-primary"
                  : "border-gray-300"
              } ${
                isDisabled ? "bg-gray-200 cursor-not-allowed opacity-60" : ""
              } 
        flex flex-col items-center justify-center border-4 rounded-[12px] py-2 px-4`}
              disabled={isDisabled}
            >
              <Header4>{option.label}</Header4>
              <Paragraph1>
                (
                {`x${option.multiplier} piece${
                  option.multiplier > 1 ? "s" : ""
                }`}
                )
              </Paragraph1>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <Header4>Select Quantity:</Header4>
        <div className="border-4 w-fit rounded-[12px] flex items-center px-4 py-1 mt-2 gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className={`${
              quantity <= 1 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <MinusIcon />
          </button>
          <Paragraph1>{quantity}</Paragraph1>
          <button
            onClick={() => {
              const nextQuantity = quantity + 1;
              const nextTotal = nextQuantity * selectedPack.multiplier;
              if (nextTotal <= product.availableAmount) {
                setQuantity(nextQuantity);
              }
            }}
            disabled={
              quantity * selectedPack.multiplier >= product.availableAmount
            }
            className={`${
              quantity * selectedPack.multiplier >= product.availableAmount
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
          >
            <Plus />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="border-t-8 border-primary my-4 gap-4 items-center flex rounded-[12px] border w-full px-4 py-2">
          <Package className="text-primary" />
          <Header3>
            {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
              totalPrice
            )}`}
          </Header3>
          {product.oldPrice && totalQuantity > 6 && (
            <Paragraph2 className="text-[12px] text-gray-700 sm:mb-0 line-through">
              {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                product.currentPrice * totalQuantity
              )}`}
            </Paragraph2>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
