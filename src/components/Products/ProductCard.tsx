import React from "react";
import { Paragraph1, Paragraph2, ParagraphLink2 } from "../Text";
import Button from "../Button";
import Link from "next/link";
import useCartStore from "../../stores/cartStore";
import AOS from "aos";
import { useExchangeRateStore } from "@/stores/exchangeRateStore";

interface ProductCardProps {
  image: string;
  title: string;
  price: any;
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  product,
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const productID = product.id;
  const { selectedCurrency, exchangeRate } = useExchangeRateStore();

  const displayPrice =
    selectedCurrency === "USD" && exchangeRate > 0
      ? price / exchangeRate // Convert to USD
      : price; // Default to NGN

  const currencySymbol = selectedCurrency === "USD" ? "$" : "₦";

  const formattedPrice =
    selectedCurrency === "USD" && typeof displayPrice === "number"
      ? displayPrice.toFixed(2) // Format for USD with 2 decimal places
      : displayPrice; // Format for NGN (comma-separated)

  const handleAddToCart = () => {
    addToCart(productID); // Just pass the ID
    // @ts-ignore
    toggleCart(true); // Ensure the cart is open
  };

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  return (
    <>
      {product.isPublish && (
        <div
          // data-aos="fade-up"
          className={`max-w-full border bg-white rounded-[24px]  overflow-hidden hover:shadow-xl transition-shadow duration-300 `}
        >
          <div className="bg-white relative hover:border-primary overflow-hidden  rounded-lg ">
            <Link href={`/products/${productID}`}>
              {" "}
              <img
                src={
                  image
                    ? image.replace("/upload/", "/upload/w_500,f_auto/")
                    : "/images/default-product.png"
                }
                alt={title}
                className="w-full h-[150px] object-cover  hover:scale-110 transition-transform duration-300 "
              />
            </Link>
            <div className=" flex flex-col  p-2 items-center   bg-white bg-opacity-65">
              <Paragraph1 className=" font-medium w-[100%] whitespace-nowrap truncate overflow-hidden">
                {" "}
                {title}{" "}
              </Paragraph1>
              <Paragraph1 className=" flex w-full">{`${currencySymbol} ${new Intl.NumberFormat(
                "en-US",
                {}
              ).format(Number(formattedPrice))}`}</Paragraph1>
              {product.availableAmount === "0" ? (
                <div className=" flex px-2  justify-center py-1 sm:hidden- w-full items-center rounded-lg bg-black text-white text-center">
                  Out of Stock
                </div>
              ) : (
                <Button
                  text="Add to Cart"
                  onClick={handleAddToCart}
                  additionalClasses="border-white justify-center flex text-center whitespace-nowrap font-semibold bg-primary w-full"
                />
              )}{" "}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
