import React, { useState, useEffect } from "react";
import { Header3, Header4, Paragraph1 } from "@/components/Text";
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
    selectedPack.multiplier > 1 && product.oldPrice
      ? product.currentPrice - (product.oldPrice - product.currentPrice)
      : product.currentPrice;

  const totalPrice = unitPrice * totalQuantity;

  useEffect(() => {
    onTotalQuantityChange(totalQuantity);
  }, [totalQuantity, onTotalQuantityChange]);

  return (
    <div>
      <Header4>How Many?</Header4>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2">
        {packOptions.map((option, index) => (
          <button
            key={option.label}
            onClick={() => setSelectedPackIndex(index)}
            className={`${
              selectedPackIndex === index
                ? "bg-[#e6f9fb] border-primary"
                : "border-gray-300"
            } flex flex-col items-center justify-center border-4 rounded-[12px] py-2 px-4`}
          >
            <Header4>{option.label}</Header4>
            <Paragraph1>
              (
              {`x${option.multiplier} piece${option.multiplier > 1 ? "s" : ""}`}
              )
            </Paragraph1>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Header4>Select Quantity:</Header4>
        <div className="border-4 w-fit rounded-[12px] flex items-center px-4 py-1 mt-2 gap-4">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            <MinusIcon />
          </button>
          <Paragraph1>{quantity}</Paragraph1>
          <button onClick={() => setQuantity((q) => q + 1)}>
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

          {product.oldPrice && selectedPack.multiplier > 1 && (
            <p className="text-[12px] text-gray-700 sm:mb-0 line-through">
              {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                product.oldPrice * totalQuantity
              )}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
