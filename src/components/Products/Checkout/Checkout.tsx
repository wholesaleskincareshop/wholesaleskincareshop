import React, { useState, useRef, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db } from "@/lib/firebase"; // Import Firestore database
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore"; // Firestore functions
import { sendEmail } from "@/lib/serverActions"; // Import server action
import useCartStore from "@/stores/cartStore";
import useUserInfoStore from "@/stores/userInfoStore"; // Import the user info store
import html2canvas from "html2canvas";
import { useExchangeRateStore } from "@/stores/exchangeRateStore";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import {
  HeaderAny,
  Paragraph2,
  ParagraphLink1,
  ParagraphLink2,
} from "@/components/Text";

type Product = {
  id: number;
  productImageURL1: string;
  name: string;
  price: number;
  quantity: number;
  currentPrice: number;
};

interface LGA {
  id: string;
  name: string;
  shippingFee: number;
}

interface State {
  id: string;
  name: string;
  shippingFee: number;
  lgas?: LGA[];
}

interface Country {
  code: string;
  name: string;
  shippingFee: number;
  states: State[];
}
type CheckoutProps = {
  products: any;
  total: number;
  logoUrl: string;
  totalProductWeight: any;
  onShippingFeeChange: (fee: number) => void; // Callback for shipping fee
  onTotalBillChange: (totalBill: number) => void;
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  phoneNumber: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  // zipCode: Yup.string().required("Required"),
});

const Checkout: React.FC<CheckoutProps> = ({
  products,
  total,
  logoUrl,
  totalProductWeight,
  onShippingFeeChange,
  onTotalBillChange,
}) => {
  const {
    email,
    phoneNumber,
    country,
    firstName,
    lastName,
    address,
    city,
    state,
    zipCode,
    saveInfo,
    setUserInfo,
  } = useUserInfoStore();
  const [activeTab, setActiveTab] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    email: email || "",
    phoneNumber: phoneNumber || "",
    country: "",
    firstName: firstName || "",
    lastName: lastName || "",
    address: address || "",
    city: city || "",
    state: "",
    zipCode: zipCode || "",
    saveInfo: saveInfo || true,
    note: "",
  });

  const [shippingMethod, setShippingMethod] = useState("Standard");
  const clearCart = useCartStore((state) => state.clearCart);
  const [isloading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [states, setStates] = useState<State[]>([]);
  const [totalShippingFee, setTotalShippingFee] = useState<number>(0);
  const [paymentDenied, setPaymentDenied] = useState(false);
  const [canceledPay, setCanceledPay] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<string>(""); // State to store payment response
  const [lgas, setLGAs] = useState<LGA[]>([]);
  const [selectedLGA, setSelectedLGA] = useState<string>("");

  const { selectedCurrency, exchangeRate } = useExchangeRateStore();

  const currencySymbol = selectedCurrency === "USD" ? "$" : "₦";

  useEffect(() => {
    const fetchShippingData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "shippingFees"));
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const formattedCountries = fetchedData.map((country) => ({
          code: (country as any).countryCode,
          name: (country as any).countryName,
          shippingFee: (country as any).shippingFee || 0,
          states: (country as any).states || [],
        }));

        setCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching shipping data:", error);
      }
    };

    fetchShippingData();
  }, []);

  const handleCountryChange = (
    value: string,
    setFieldValue: (field: string, value: any) => void,
    totalProductWeight: number = 0 // Default to 0 if not provided
  ) => {
    setSelectedCountryCode(value);

    const country = countries.find((c) => c.code === value);
    if (country) {
      setStates(country.states || []);
      setFieldValue("state", "");
      calculateTotalShippingFee(country.shippingFee, 0, totalProductWeight); // Pass totalProductWeight
    } else {
      setStates([]);
      calculateTotalShippingFee(0, 0, totalProductWeight); // Pass totalProductWeight
    }

    setFieldValue("country", value);
  };

  const handleStateChange = (
    value: string,
    setFieldValue: (field: string, value: any) => void,
    totalProductWeight: number = 0
  ) => {
    setSelectedState(value);
    setSelectedLGA(""); // reset LGA when state changes
    setFieldValue("state", value);
    setFieldValue("city", ""); // clear previous LGA

    const country = countries.find((c) => c.code === selectedCountryCode);
    const state = states.find((s) => s.name === value); // ← use 'value' directly

    if (state) {
      setLGAs(state.lgas || []);
    } else {
      setLGAs([]);
    }

    const countryFee = country?.shippingFee || 0;
    const stateFee = state?.shippingFee || 0;

    calculateTotalShippingFee(countryFee, stateFee, totalProductWeight);
  };

  const handleLGAChange = (
    value: string,
    setFieldValue: (field: string, value: any) => void,
    totalProductWeight: number
  ) => {
    setSelectedLGA(value);
    setFieldValue("city", value);

    const country = countries.find((c) => c.code === selectedCountryCode);
    const state = states.find((s) => s.name === selectedState);
    const lga = lgas.find((l) => l.name === value); // ← use 'value' directly

    const countryFee = country?.shippingFee || 0;
    const stateFee = state?.shippingFee || 0;
    const lgaFee = lga?.shippingFee || 0;

    calculateTotalShippingFee(countryFee, stateFee, totalProductWeight, lgaFee);
  };

  const calculateTotalShippingFee = (
    countryFee: number,
    stateFee: number = 0,
    totalProductWeight: number = 0,
    lgaFee: number = 0
  ) => {
    const baseFee = countryFee + stateFee + lgaFee;

    // Determine multiplier based on 15kg chunks
    const weightMultiplier = Math.ceil(totalProductWeight / 15) || 1;

    const total = baseFee * weightMultiplier;

    setTotalShippingFee(total);
    console.log({
      countryFee,
      stateFee,
      lgaFee,
      totalProductWeight,
      baseFee,
      weightMultiplier,
      total,
    });
  };

  useEffect(() => {
    const country = countries.find((c) => c.code === selectedCountryCode);
    const state = states.find((s) => s.name === selectedState); // Replace "" with the selected state if tracking
    const lga = lgas.find((l) => l.name === selectedLGA); // include LGA

    if (country) {
      calculateTotalShippingFee(
        country.shippingFee,
        state?.shippingFee ?? 0,
        totalProductWeight,
        lga?.shippingFee ?? 0
      );
    }
  }, [selectedCountryCode, states, totalProductWeight, lgas,]);

  const handleNext = (values: typeof shippingInfo) => {
    setShippingInfo(values);
    setActiveTab((prev) => prev + 1);
  };

  const handleBack = () => setActiveTab((prev) => prev - 1);

  const handleSaveInfo = (values: any, save: boolean) => {
    if (save) {
      setUserInfo({
        ...values,
        saveInfo: true,
      });
    }
  };

  const totalBill = total + totalShippingFee;

  const sanitizeProduct = (product: any) => {
    if (
      !product.id ||
      !product.name ||
      product.productImageURL1 === undefined ||
      product.quantity === undefined ||
      product.currentPrice === undefined
    ) {
      throw new Error(`Invalid product data: ${JSON.stringify(product)}`);
    }

    return {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      productImageURL1: product.productImageURL1,
      price: parseFloat(product.currentPrice), // Ensure numeric type
      totalPrice: product.quantity * parseFloat(product.currentPrice),
    };
  };

  const submitOrderToFirestore = async (values: any) => {
    setIsLoading(true);

    try {
      // Sanitize and format the products array
      const sanitizedProducts = products.map(sanitizeProduct);

      // Add the order document to Firestore
      const docRef = await addDoc(collection(db, "Orders"), {
        ...values,
        timestamp: new Date(),
        viewed: false,
        shipped: false,
        returned: false,
        shippingFee: totalShippingFee,
        totalPaid: totalBill,
        products: sanitizedProducts, // Use sanitized products
      });

      console.log("Document written with ID: ", docRef.id);

      // Update the available quantity for each product
      const updateProductPromises = products.map(async (product: any) => {
        const productRef = doc(db, "products", product.id);

        // Fetch the current availableAmount
        const productSnapshot = await getDoc(productRef);
        if (!productSnapshot.exists()) {
          throw new Error(`Product with ID ${product.id} does not exist.`);
        }

        const productData = productSnapshot.data();
        const availableAmount = parseInt(productData.availableAmount, 10); // Ensure numeric
        const newAvailableAmount = availableAmount - product.quantity;

        // Check if the quantity is sufficient
        if (newAvailableAmount < 0) {
          throw new Error(
            `Not enough stock for product ${product.name}. Only ${availableAmount} available.`
          );
        }

        // Update the availableAmount in Firestore
        await updateDoc(productRef, { availableAmount: newAvailableAmount });
      });

      // Wait for all updates to complete
      await Promise.all(updateProductPromises);

      // Send email notification
      await sendEmail();

      setIsLoading(false); // Mark loading as complete
      console.log("Order and product quantities updated successfully.");
    } catch (error) {
      console.error("Error processing order: ", error);
      setIsLoading(false); // Mark loading as complete in case of error
    }
  };

  const handleDownloadReceipt = async () => {
    const receiptDiv = document.getElementById("receipt");

    if (receiptDiv) {
      // Ensure images are loaded
      const images = receiptDiv.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise((resolve) => {
            if (img.complete) resolve(true);
            else img.onload = img.onerror = () => resolve(true);
          });
        })
      );

      // Capture the receipt div
      const canvas = await html2canvas(receiptDiv, {
        useCORS: true,
        height: 1122,
        scale: 2,
      });

      // Convert to image and download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "receipt-a4.png";
      link.click();
    }

    // Clear the cart
    clearCart();

    window.location.href = "/";
  };

  useEffect(() => {
    onShippingFeeChange(totalShippingFee); // Notify the parent about the shipping fee
    const totalBill = total + totalShippingFee;
    onTotalBillChange(totalBill); // Notify the parent about the total bill
  }, [totalShippingFee, total, onShippingFeeChange, onTotalBillChange]);

  const totalBillWave =
    selectedCurrency === "USD" && exchangeRate > 0
      ? (totalBill / exchangeRate).toFixed(2)
      : totalBill;

  const currencyWave = selectedCurrency === "USD" ? "USD" : "NGN";

  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

  const config = {
    public_key: publicKey,
    tx_ref: Date.now(),
    amount: totalBillWave,
    currency: currencyWave,
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email,
      phone_number: phoneNumber,
      name: `${firstName} ${lastName}`,
    },
    customizations: {
      title: "GrandioseGrin Pay",
      description: "Payment for items in cart",
      logo: "https://res.cloudinary.com/dtipo8fg3/image/upload/v1732334982/favicon_hpd5wv.png",
    },
  };

  // @ts-ignore
  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className="  space-y-6 bg-white sm:p-4 p-0 relative rounded-lg">
      {isloading && (
        <div className=" absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      <div className="flex justify-around- items-center gap-2 border-b- pb-3">
        <div
          // onClick={() => setActiveTab(0)}
          className={`text-sm  ${
            activeTab === 0 ? "text-primary font-semibold" : "text-gray-400"
          }`}
        >
          Information
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>

        <div
          // onClick={() => setActiveTab(1)}
          className={`text-sm ${
            activeTab === 1 ? "text-primary font-semibold" : "text-gray-400"
          }`}
        >
          Payment
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
        <div
          // onClick={() => setActiveTab(2)}
          className={`text-sm  ${
            activeTab === 2 ? "text-primary font-semibold" : "text-gray-400"
          }`}
        >
          Receipt
        </div>
      </div>

      {/* Information Tab */}
      {activeTab === 0 && (
        <Formik
          initialValues={shippingInfo}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleNext(values);
            handleSaveInfo(values, values.saveInfo);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4 min-h-screen">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                      Email
                    </ParagraphLink2>
                    <Field
                      name="email"
                      type="email"
                      className="mt-1 block w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                      Phone number
                    </ParagraphLink2>
                    <Field
                      name="phoneNumber"
                      className="mt-1 block w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                    First Name
                  </ParagraphLink2>
                  <Field
                    name="firstName"
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                    Last Name
                  </ParagraphLink2>
                  <Field
                    name="lastName"
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                  Address
                </ParagraphLink2>
                <Field
                  name="address"
                  className="mt-1 block w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                  Country
                </ParagraphLink2>
                <Field
                  name="country"
                  as="select"
                  className="mt-1 block w-full p-2 border rounded-md"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleCountryChange(
                      e.target.value,
                      setFieldValue,
                      totalProductWeight
                    )
                  }
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                  State
                </ParagraphLink2>

                <Field
                  name="state"
                  as="select"
                  className="mt-1 block w-full p-2 border rounded-md"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleStateChange(
                      e.target.value,
                      setFieldValue,
                      totalProductWeight
                    )
                  }
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                    LGA/City
                  </ParagraphLink2>
                  <Field
                    name="city"
                    as="select"
                    className="mt-1 block w-full p-2 border rounded-md"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleLGAChange(
                        e.target.value,
                        setFieldValue,
                        totalProductWeight
                      )
                    }
                  >
                    <option value="">Select LGA/city</option>
                    {lgas.map((lga) => (
                      <option key={lga.id} value={lga.name}>
                        {lga.name}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                    Zip Code
                  </ParagraphLink2>
                  <Field
                    name="zipCode"
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                  {/* <ErrorMessage
                    name="zipCode"
                    component="div"
                    className="text-red-500 text-sm"
                  /> */}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] ">
                <Field
                  type="checkbox"
                  name="saveInfo"
                  // className="mr-2"
                  className="form-checkbox min-h-4 min-w-4 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                />
                <ParagraphLink2>
                  Save this information for next time
                </ParagraphLink2>
              </div>

              <div>
                <ParagraphLink2 className="block text-sm font-bold text-gray-700">
                  Message/Note
                </ParagraphLink2>
                <Field
                  name="note"
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Add a message or ask for product advice, or write a note for your friend if this is a gift..."
                />
              </div>
              <button
                type="submit"
                className="w-full font-bold bg-primary text-white py-2 rounded-md hover:bg-black "
              >
                <ParagraphLink2>Next</ParagraphLink2>
              </button>
            </Form>
          )}
        </Formik>
      )}

      {/* Payment Tab */}
      {activeTab === 1 && (
        <div className="space-y-4 m ">
          <div className="border-b pb-3 space-y-2 ">
            <HeaderAny className="font-semibold text-16px text-gray-700">
              Confirm Contact & Address
            </HeaderAny>
            <p className="text-gray-600">
              {shippingInfo.firstName} <span> {shippingInfo.lastName}</span>
            </p>
            <p className="text-gray-600 outline-none">
              {shippingInfo.phoneNumber}
            </p>
            <p className="text-gray-600 div-email outline-none text-decoration-none">
              {shippingInfo.email}
            </p>

            <p className="text-gray-600 pb-6">
              {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state},{" "}
              {shippingInfo.zipCode}
            </p>
          </div>

          <div className="min-h-[200px] ">
            <HeaderAny className="font-semibold text-16px text-gray-700">
              Select Shipping Method
            </HeaderAny>
            <div className="flex flex-col space-y-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="Pickup"
                  checked={shippingMethod === "Pickup"}
                  onChange={() => setShippingMethod("Pickup")}
                  className="form-checkbox min-h-5 min-w-5  appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary- rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                  disabled
                />
                <span className=" text-gray-400">
                  Pickup (not available in your location)
                </span>
              </label>
              {/* store location */}
              {shippingMethod === "Pickup" && (
                <div>
                  <div className="flex text-gray-600 gap-2 items-start w-full p-2 rounded-lg bg-gray-100">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>
                    </div>
                    <p>
                      17 Raphael Street Abule-Oshun, <br /> Ojo, <br /> Lagos
                      State, <br /> Nigeria
                    </p>
                  </div>
                </div>
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="Standard"
                  checked={shippingMethod === "Standard"}
                  onChange={() => setShippingMethod("Standard")}
                  className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                />
                <span>Standard Shipping</span>
              </label>
              {/* user location */}
              {shippingMethod === "Standard" && (
                <div>
                  <div className="flex gap-2 text-gray-600 items-start w-full p-2 rounded-lg bg-gray-100">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>
                    </div>
                    <p>
                      {shippingInfo.address}, <br /> {shippingInfo.city}, <br />
                      {shippingInfo.state}, {shippingInfo.zipCode}
                      <br />
                      <br />
                      Estimated Arrival Date: 2 to 10 working days.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {paymentDenied && (
              <div className=" flex p-4 items-center h-[200px] w-full  justify-center rounded-lg border mt-4 bg-white bg-opacity-50 z-50">
                <p>
                  Your payment was declined. Please{" "}
                  <span
                    onClick={() => window.location.reload()}
                    className=" text-primary underline cursor-pointer"
                  >
                    try again later.{" "}
                  </span>
                </p>
              </div>
            )}

            {canceledPay && (
              <div className=" flex p-4 items-center justify-center h-[200px] w-full rounded-lg border mt-4 bg-white bg-opacity-50 z-50">
                <p>
                  Your payment was canceled by you. Please{" "}
                  <span
                    onClick={() => window.location.reload()}
                    className=" text-primary underline cursor-pointer"
                  >
                    try again later.{" "}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-between pt-8">
            <button
              onClick={handleBack}
              className="w-full  font-bold bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              <ParagraphLink2>Back</ParagraphLink2>
            </button>
            <button
              onClick={() => {
                handleFlutterPayment({
                  callback: (response) => {
                    console.log(response);
                    if (response.status === "successful") {
                      const PaymentFlw_ref = response.flw_ref;
                      setPaymentResponse(PaymentFlw_ref);
                      submitOrderToFirestore(shippingInfo);
                      setActiveTab(2);
                    } else {
                      setPaymentDenied(true);
                    }
                    closePaymentModal();
                  },
                  onClose: () => {
                    setCanceledPay(true);
                  },
                });
              }}
              className={`w-full font-bold bg-primary text-white p-2 rounded-md hover:bg-black ml-4 ${
                paymentDenied || canceledPay
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={paymentDenied || canceledPay} // Disable the button conditionally
            >
              <ParagraphLink2>Proceed to Payment</ParagraphLink2>{" "}
            </button>
          </div>
        </div>
      )}

      {/* Receipt Tab */}
      {activeTab === 2 && (
        <div>
          <div
            id="receipt"
            className="space-y-6 p-4  max-w-[793px]  min-h-screen relative"
          >
            <img
              src={logoUrl}
              alt="Company Logo"
              className="mx-auto w- h-[25px]"
            />

            <p className=" text-center text-gray-500 text-[12px]">
              Payment Successful
            </p>
            <div>
              <h2 className="font-semibold text-gray-700 mb-2">
                Custmer Details
              </h2>
              <div className=" border rounded-lg text-[13px] p-4">
                <div className=" flex items-center w-full gap-2 mb-2">
                  <div className=" text-gray-500  ">Name:</div>
                  <div className=" px-2 py-1  rounded-lg- w-full">
                    <Paragraph2>
                      {" "}
                      {firstName} {lastName}
                    </Paragraph2>
                  </div>
                </div>
                <div className=" pb-4 flex items-center w-full gap-2">
                  <div className="  text-gray-500 whitespace-nowrap">
                    Email:
                  </div>
                  <div className=" div-email px-2 py-1  text-decoration-none rounded-lg- w-full outline-none">
                    <Paragraph2> {email}</Paragraph2>
                  </div>
                </div>

                <div className="pb-4 flex items-start w-full gap-2">
                  <div className="text-gray-500 whitespace-nowrap">
                    Location:
                  </div>
                  <div className="div-email px-2 py-1 text-decoration-none rounded-lg w-full outline-none">
                    <Paragraph2>
                      {" "}
                      {shippingMethod === "Pickup"
                        ? "17 Raphael Street Abule-Oshun, Ojo, Lagos State, Nigeria"
                        : `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.zipCode}`}
                    </Paragraph2>{" "}
                  </div>
                </div>

                <div className=" text-gray-500 text-[12px] sm:flex  items-center w-full gap-2">
                  <div className=" whitespace-nowrap  ">
                    Transaction Reference:
                  </div>
                  <div className="  py-1  rounded-lg- w-full outline-none">
                    {paymentResponse}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Order Summary</h3>

              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="grid grid-cols-3 sm:grid-cols-5 items-center py-4 border-b "
                >
                  <div className=" col-span-2 flex items-center gap-2">
                    <img
                      src={product.productImageURL1}
                      alt={product.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="text-gray-700">{product.name}</p>

                      <p className="text-gray-700 sm:hidden ">
                        {" "}
                        {`${currencySymbol} ${new Intl.NumberFormat(
                          "en-US"
                        ).format(
                          Number(
                            selectedCurrency === "USD" && exchangeRate > 0
                              ? (product.currentPrice / exchangeRate).toFixed(2)
                              : product.currentPrice
                          )
                        )}`}
                      </p>
                      <p className="text-gray-700 sm:hidden block">
                        Qt: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 sm:block hidden">
                    {" "}
                    {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                      Number(
                        selectedCurrency === "USD" && exchangeRate > 0
                          ? (product.currentPrice / exchangeRate).toFixed(2)
                          : product.currentPrice
                      )
                    )}`}
                  </p>

                  <p className="text-gray-700 hidden sm:block">
                    Qt: {product.quantity}
                  </p>
                  <p className="text-gray-700 font-semibold text-end">
                    {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                      Number(
                        (selectedCurrency === "USD" && exchangeRate > 0
                          ? (product.currentPrice / exchangeRate).toFixed(2)
                          : product.currentPrice) * product.quantity
                      )
                    )}`}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 font-semibold flex justify-between text-gray-700">
              <p>Shipping fee</p>
              <p>{`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                Number(
                  selectedCurrency === "USD" && exchangeRate > 0
                    ? totalShippingFee / exchangeRate
                    : totalShippingFee
                )
              )}`}</p>
            </div>
            <div className=" font-semibold flex justify-between text-gray-700">
              <p>Total</p>
              <p>{`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                Number(
                  selectedCurrency === "USD" && exchangeRate > 0
                    ? totalBill / exchangeRate
                    : totalBill
                )
              )}`}</p>
            </div>
          </div>
          <button
            onClick={handleDownloadReceipt}
            className=" text-center font-bold px-6 w-full  bg-primary text-white py-2 rounded-md hover:bg-black "
          >
            <ParagraphLink2>Download Receipt</ParagraphLink2>
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
