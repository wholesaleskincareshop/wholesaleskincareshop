import React, { useState, useEffect } from "react";
import { Header4, Paragraph1, ParagraphLink1 } from "../Text";
import Link from "next/link";
import ProductCartCard from "./ProductCartCard";
import useCartStore from "@/stores/cartStore";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, query, where, getDocs } from "firebase/firestore";
import { useExchangeRateStore } from "@/stores/exchangeRateStore";

type Product = {
  id: string; // Firestore document IDs are strings
  image: string;
  title: string;
  price: number;
  quantity: number;
  currentPrice: any;
  oldPrice: any;
};

type CartSummaryProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartSummary: React.FC<CartSummaryProps> = ({ isOpen, onClose }) => {
  const cart = useCartStore((state) => state.cart);
  const [products, setProducts] = useState<Product[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const { selectedCurrency, exchangeRate } = useExchangeRateStore();

  useEffect(() => {
    if (cart.length > 0) {
      const fetchProducts = async () => {
        try {
          const ids = cart.map((item) => item.id);

          // Firestore query to get products by ID
          const productsRef = collection(db, "products");
          const productsQuery = query(
            productsRef,
            where("__name__", "in", ids)
          );
          const querySnapshot = await getDocs(productsQuery);

          const productDetails = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Include Firestore document ID
            ...doc.data(),
          })) as Omit<Product, "quantity">[]; // Exclude quantity initially

          // Map with cart quantities
          const updatedProducts = productDetails.map((product) => ({
            ...product,
            quantity:
              cart.find((item) => item.id === product.id)?.quantity || 1,
          }));

          setProducts(updatedProducts);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };

      fetchProducts();
    } else {
      setProducts([]); // Clear products if cart is empty
    }
  }, [cart]);

    const currencySymbol = selectedCurrency === "USD" ? "$" : "₦";


    const subtotal = products.reduce((total, product) => {
      const unitPrice =
        product.oldPrice && product.quantity > 6
          ? product.oldPrice
          : product.currentPrice;

      return total + unitPrice * product.quantity;
    }, 0);

  

  const handleQuantityChange = (productId: string, delta: number) => {
    const cartStore = useCartStore.getState();
    const existingProduct = cart.find((item) => item.id === productId);

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + delta;

      if (newQuantity > 0) {
        // Update the quantity directly in the store
        cartStore.cart = cartStore.cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, quantity: newQuantity }
              : product
          )
        );
      } else {
        // Remove the product if the quantity reaches zero
        cartStore.removeFromCart(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
    // Sync removal with Zustand store
    useCartStore.getState().removeFromCart(productId);
  };

  return (
    <div
      className={`fixed top-0 z-20 border right-0 h-full text-p_black w-full sm:w-[400px] bg-bg_gray shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Header4 className="text-lg font-semibold">Cart</Header4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 border px-2 py-1 rounded-lg"
        >
          &#x2715;
        </button>
      </div>

      {/* Product List */}
      <div className="p-4 relative space-y-4 overflow-y-auto h-[300px] scrollbar-hide">
        {isloading && (
          <div className=" absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCartCard
              key={product.id}
              product={product}
              onRemove={handleRemoveProduct}
              onQuantityChange={handleQuantityChange}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 border-t space-y-2">
        <div className="flex justify-between">
          <Paragraph1>Shipping:</Paragraph1>
          <Paragraph1 className="text-gray-500">
            Calculated at checkout
          </Paragraph1>
        </div>
        <div className="flex justify-between font-semibold">
          <ParagraphLink1>Total:</ParagraphLink1>
          <ParagraphLink1>
            {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
              Number(
                selectedCurrency === "USD" && exchangeRate > 0
                  ? (subtotal / exchangeRate).toFixed(2)
                  : subtotal
              )
            )}`}
          </ParagraphLink1>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="p-4">
        <Link
          onClick={onClose}
          href="/products/checkout"
          className="w-full flex justify-center py-2 bg-primary text-white font-semibold rounded-lg hover:bg-black transition"
        >
          <ParagraphLink1>Proceed to Checkout</ParagraphLink1>
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
