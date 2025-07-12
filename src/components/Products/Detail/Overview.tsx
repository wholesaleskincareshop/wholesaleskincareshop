"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import {
  Header3,
  Header4,
  Header5,
  Paragraph2,
  ParagraphLink1,
} from "@/components/Text";
import Button from "@/components/Button";
import Section6 from "@/components/home/sections/Section6";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import useCartStore from "@/stores/cartStore";
import { useExchangeRateStore } from "@/stores/exchangeRateStore";
import Link from "next/link";
import CopyUrlButton from "./CopyUrlButton";
import { MinusIcon, Package, Plus } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

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

const ProductDetail = () => {
  const { productID } = useParams() as { productID: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { selectedCurrency, exchangeRate } = useExchangeRateStore();

  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);


  
  const handleTotalQuantityChange = (total: number) => {
    console.log("Total quantity:", total);
    setSelectedQuantity(total); // Save total quantity selected
  };

  useEffect(() => {
    if (!productID) return;

    const fetchProductAndRelated = async () => {
      try {
        // Fetch main product
        const productRef = doc(db, "products", productID);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data() as Product;

          // Dynamically construct images array
          const productImages = [
            productData.productImageURL1,
            productData.productImageURL2,
            productData.productImageURL3,
            productData.productImageURL4,
            productData.productImageURL5,
          ].filter((url) => url !== undefined); // Filter out undefined values

          setProduct({ ...productData, productImages });
          setSelectedImage(productImages[0] || null); // Set the first image as selected by default

          // Fetch related products
          const relatedQuery = query(collection(db, "products"));
          const relatedSnap = await getDocs(relatedQuery);
          const related: Product[] = [];
          relatedSnap.forEach((doc) => {
            const data = doc.data() as Omit<Product, "id">; // Exclude 'id'
            related.push({ id: doc.id, ...data });
          });

          setRelatedProducts(related);
        } else {
          console.error("No product found with this ID");
        }
      } catch (error) {
        console.error("Error fetching product or related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [productID]);

  const shuffledProducts = [...relatedProducts].sort(() => 0.5 - Math.random());
  const randomProducts = shuffledProducts.slice(0, 4);

  const handleAddToCart = () => {
    addToCart(productID, selectedQuantity); // Pass selected quantity
    // @ts-ignore
    toggleCart(true); // Ensure the cart is open
  };

  const displayPrice2 =
    selectedCurrency === "USD" &&
    exchangeRate > 0 &&
    product?.oldPrice !== undefined
      ? product?.oldPrice / exchangeRate // Convert to USD
      : product?.oldPrice; // Default to NGN

  const displayPrice =
    selectedCurrency === "USD" &&
    exchangeRate > 0 &&
    product?.currentPrice !== undefined
      ? product?.currentPrice / exchangeRate // Convert to USD
      : product?.currentPrice; // Default to NGN

  const currencySymbol = selectedCurrency === "USD" ? "$" : "₦";

  const formattedPrice =
    selectedCurrency === "USD" && typeof displayPrice === "number"
      ? displayPrice.toFixed(2) // Format for USD with 2 decimal places
      : displayPrice; // Format for NGN (comma-separated)

  const formattedPrice2 =
    selectedCurrency === "USD" && typeof displayPrice2 === "number"
      ? displayPrice2.toFixed(2) // Format for USD with 2 decimal places
      : displayPrice2; // Format for NGN (comma-separated)

  if (loading)
    return (
      <div className=" absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50 ">
        <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (!product) return <div>Product not found.</div>;

  return (
    <div>
      <div className="container1  py-[70px]">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-8 bg-white py-4 sm:py-8 rounded-lg">
          {/* Right section - Product Images */}
          <div className="sm:col-span-3">
            <div className="w-full sm:h-[500px] rounded-lg mb-4 flex items-center justify-center">
              <img
                src={selectedImage!.replace(
                  "/upload/",
                  "/upload/w_1000,f_auto/"
                )}
                alt="Selected Product"
                className="max-h-full sm:h-screen h-[300px] w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex gap-2 w-full overflow-hidden overflow-x-auto scrollbar-hide p-1">
              {product.productImages?.map((image: any, index: any) => (
                <img
                  key={index}
                  src={
                    image
                      ? image.replace("/upload/", "/upload/w_500,f_auto/")
                      : "/images/default-product.png"
                  }
                  alt={`Product thumbnail ${index + 1}`}
                  className={`h-20 w-20 object-cover rounded-lg cursor-pointer ${
                    selectedImage === image ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Left section - Product Details */}
          <div className="sm:col-span-3">
            <Header3>{product.name}</Header3>

            <Paragraph2 className=" mb-4 mt-2">
              Avaliable quantity: {product.availableAmount}{" "}
            </Paragraph2>

            <QuantitySelector
              product={product}
              currencySymbol={currencySymbol}
              onTotalQuantityChange={handleTotalQuantityChange}
            />
            <div className=" flex justify-between gap-2 items-center">
              {product.availableAmount === "0" ? (
                <div className="py-2 flex w-full justify-center items-center rounded-lg bg-black text-white text-center">
                  Out of Stock
                </div>
              ) : (
                <Button
                  text="Add to Cart"
                  onClick={handleAddToCart}
                  additionalClasses="border-white bg-black w-full flex justify-center "
                />
              )}

              <CopyUrlButton />
            </div>
            <div className="mt-6 text-gray-600  flex flex-co items-center justify-center">
              <p>
                We'd love to also hear your thoughts on this product.{" "}
                <span>
                  <Link href="/contact-us" className="text-primary underline">
                    Contact us today
                  </Link>
                </span>{" "}
                to get started.
              </p>
            </div>
          </div>
        </div>

        <div className="">
          <Header4 className="font-medium">Description</Header4>
          <hr className="mb-4" />

          <p
            className="text-gray-600 mb-6 text-justify"
            dangerouslySetInnerHTML={{
              __html: product.description.replace(/\n/g, "<br />"),
            }}
          ></p>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <Header5 className="text-2xl font-semibold mb-4">
            Other Products
          </Header5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {randomProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                image={
                  relatedProduct.productImageURL1 || "" // Use the first image of related products
                }
                title={relatedProduct.name}
                price={relatedProduct.currentPrice}
                product={relatedProduct}
              />
            ))}
          </div>
        </div>
      </div>
      <Section6 />
    </div>
  );
};

export default ProductDetail;
