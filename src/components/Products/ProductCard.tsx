import React from "react";
import { Paragraph2, ParagraphLink2 } from "../Text";
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
    selectedCurrency === "USD"
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
          className={`max-w-full bg-white rounded-lg  overflow-hidden hover:shadow-xl transition-shadow duration-300 `}
        > 
          <div className="bg-white relative p-2 hover:border-primary overflow-hidden  rounded-lg ">
            <Link href={`/products/${productID}`}>
              {" "}
              <img
                src={
                  image
                    ? image.replace("/upload/", "/upload/w_500,f_auto/")
                    : "/images/default-product.png"
                }
                alt={title}
                className="w-full h-[120px] object-cover rounded-lg hover:scale-110 transition-transform duration-300 "
              />
            </Link>
            <div className=" flex flex-col justify-center border-t- pt-2 items-center   ga -rounded-lg  bg-white bg-opacity-65">
              <p className=" text-[13px] xl:text-[14px] font-medium text-center  whitespace-nowrap w-[100%] truncate overflow-hidden">
                {" "}
                {title}{" "}
              </p>
              <Paragraph2>{`${currencySymbol} ${new Intl.NumberFormat(
                "en-US",
                {}
              ).format(Number(formattedPrice))}`}</Paragraph2>
              {product.availableAmount === "0" ? (
                <div className=" flex px-2 text-[13px] justify-center py-1 sm:hidden- w-full items-center rounded-lg bg-black text-white text-center">
                  Out of Stock
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="whitespace-nowrap font-semibold   flex justify-center py-1 bg-primary hover:bg-black rounded-lg w-full  text-white "
                >
                  <ParagraphLink2>Add to Cart</ParagraphLink2>
                </button>
              )}{" "}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
