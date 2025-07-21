"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, addDoc, getDocs } from "firebase/firestore"; // Firebase methods
import toast from "react-hot-toast";
import {
  Header2,
  Header3,
  Header4,
  Header5,
  ParagraphLink1,
} from "@/components/Text";
import ManageCategories from "./ManageCategories";

type ProductValues = {
  name: string;
  productImageURL1: string;
  productImagePublicId1?: string;
  productImageURL2: string;
  productImagePublicId2?: string;
  productImageURL3: string;
  productImagePublicId3?: string;
  productImageURL4: string;
  productImagePublicId4?: string;
  productImageURL5: string;
  productImagePublicId5?: string;
  currentPrice: number;
  oldPrice: number;
  availableAmount: number;
  productWeight: number;
  category: string;
  selectedCategory: any;
  sub_category: string;
  selectedSubCategory: any;
  description: string;
  isFeatured: boolean;
  isTrending: boolean;
  isElite: boolean;
  isSpecial: boolean;
  isBudget: boolean;
  isPublish: boolean;
};

const initialValues: ProductValues = {
  name: "",
  productImageURL1: "",
  productImagePublicId1: "",
  productImageURL2: "",
  productImagePublicId2: "",
  productImageURL3: "",
  productImagePublicId3: "",
  productImageURL4: "",
  productImagePublicId4: "",
  productImageURL5: "",
  productImagePublicId5: "",
  currentPrice: 0,
  oldPrice: 0,
  availableAmount: 0,
  productWeight: 0,
  category: "",
  selectedCategory: {},
  sub_category: "",
  selectedSubCategory: {},
  description: "",
  isFeatured: false,
  isTrending: false,
  isElite: false,
  isSpecial: false,
  isBudget: false,
  isPublish: false
};

interface Category {
  id: string;
  name: string;
  parentId: string;
  properties: Record<string, any>; // Store additional properties of the category
}

interface SubCategory {
  id: string;
  name: string;
  parentId: string;
  properties: Record<string, any>; // Store additional properties of the category
}

interface AddMoreProps {
  onRefetch: () => void; // Define the type of the prop
}

const AddMore: React.FC<AddMoreProps> = ({ onRefetch }) => {

  const [isAddMoreOpen, setIsAddMoreOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [isloading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(""); // State for input
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "category"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoriesData);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories: ", error);
        toast.error("Failed to fetch categories.");
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    currentPrice: Yup.number().required("Current price is required"),
    oldPrice: Yup.number().required("Old price is required"),
    availableAmount: Yup.number().required("Avaliable quantity is required"),
    productWeight: Yup.number().required("Product weight quantity is required"),

    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
  });

  // AddMore.tsx or wherever your file upload is handled

  const handleImageUpload = async (
    file: File,
    setFieldValue: any,
    fieldName: string,
    oldImagePublicId?: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "e-shop");

    try {
      setIsLoading(true);

      // Delete the old image if there's a public ID
      if (oldImagePublicId) {
        console.log(
          "Attempting to delete old image with public_id:",
          oldImagePublicId
        );

        const deleteResponse = await fetch("/api/delete-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public_id: oldImagePublicId }),
        });

        const deleteData = await deleteResponse.json();
        console.log("Delete response from Cloudinary:", deleteData);

        if (!deleteResponse.ok) {
          console.error("Failed to delete the image:", deleteData);
          toast.error("Failed to delete old image.");
          return;
        }
      }

      // Upload the new image
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtipo8fg3/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      // Set the new image URL
      setFieldValue(fieldName, data.secure_url);
      // Save the public_id of the new image
      setFieldValue("productImagePublicId", data.public_id);
    } catch (error) {
      console.error("Error uploading or deleting image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: ProductValues) => {
    setIsLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        ...values,
        createdAt: new Date(),
      });
      setIsLoading(false);
      setIsAddProductOpen(false);
      onRefetch();
    } catch (error) {
      console.error("Error adding product: ", error);
      toast.error("Failed to add product.");
    }
  };



  const formatCurrency = (value: any) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    return `₦ ${Number(numericValue).toLocaleString()}`; // Format as currency
  };

  return (
    <div>
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center text-[14px] justify-center bg-black bg-opacity-50">
          <div className="  rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6  px-6 relative py-4  bg-white   ring-1 ring-black ring-opacity-5">
            {isloading && (
              <div className=" absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            <Header5 className="text-lg font-semibold mb-4">
              Add New Product{" "}
            </Header5>
            <div className=" h-[500px] overflow-hidden overflow-y-auto scrollbar-hide">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form className=" space-y-6">
                    <div>
                      <label>Images</label>
                      <div className=" grid grid-cols-2 sm:grid-cols-5  gap-2 object-cover">
                        {/* Image 1 */}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file)
                                handleImageUpload(
                                  file,
                                  setFieldValue,
                                  "productImageURL1",
                                  values.productImagePublicId1 // Pass the public ID of the old image
                                );
                            }}
                            className="hidden" // Hide the default file input
                            id="image-upload-1" // Set an id to reference the input
                          />

                          <label
                            htmlFor="image-upload-1"
                            className="h-[100px] w-full bg-bg_gray rounded-lg flex items-center justify-center cursor-pointer"
                          >
                            {!values.productImageURL1 ? (
                              <span className="text-2xl text-gray-500">+</span> // Show plus sign if no image
                            ) : (
                              <div className="h-[100px] object-cover w-full bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={values.productImageURL1}
                                  alt="Uploaded Preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </label>
                        </div>

                        {/* Image 2 */}

                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file)
                                handleImageUpload(
                                  file,
                                  setFieldValue,
                                  "productImageURL2",
                                  values.productImagePublicId2 // Pass the public ID of the old image
                                );
                            }}
                            className="hidden" // Hide the default file input
                            id="image-upload-2" // Set an id to reference the input
                          />

                          <label
                            htmlFor="image-upload-2"
                            className="h-[100px] w-full bg-bg_gray rounded-lg flex items-center justify-center cursor-pointer"
                          >
                            {!values.productImageURL2 ? (
                              <span className="text-2xl text-gray-500">+</span> // Show plus sign if no image
                            ) : (
                              <div className="h-[100px] object-cover w-full bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={values.productImageURL2}
                                  alt="Uploaded Preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </label>
                        </div>

                        {/* Image 3 */}

                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file)
                                handleImageUpload(
                                  file,
                                  setFieldValue,
                                  "productImageURL3",
                                  values.productImagePublicId3 // Pass the public ID of the old image
                                );
                            }}
                            className="hidden" // Hide the default file input
                            id="image-upload-3" // Set an id to reference the input
                          />

                          <label
                            htmlFor="image-upload-3"
                            className="h-[100px] w-full bg-bg_gray rounded-lg flex items-center justify-center cursor-pointer"
                          >
                            {!values.productImageURL3 ? (
                              <span className="text-2xl text-gray-500">+</span> // Show plus sign if no image
                            ) : (
                              <div className="h-[100px] object-cover w-full bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={values.productImageURL3}
                                  alt="Uploaded Preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </label>
                        </div>

                        {/* Image 4 */}

                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file)
                                handleImageUpload(
                                  file,
                                  setFieldValue,
                                  "productImageURL4",
                                  values.productImagePublicId4 // Pass the public ID of the old image
                                );
                            }}
                            className="hidden" // Hide the default file input
                            id="image-upload-4" // Set an id to reference the input
                          />

                          <label
                            htmlFor="image-upload-4"
                            className="h-[100px] w-full bg-bg_gray rounded-lg flex items-center justify-center cursor-pointer"
                          >
                            {!values.productImageURL4 ? (
                              <span className="text-2xl text-gray-500">+</span> // Show plus sign if no image
                            ) : (
                              <div className="h-[100px] object-cover w-full bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={values.productImageURL4}
                                  alt="Uploaded Preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </label>
                        </div>

                        {/* Image 5 */}

                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file)
                                handleImageUpload(
                                  file,
                                  setFieldValue,
                                  "productImageURL5",
                                  values.productImagePublicId5 // Pass the public ID of the old image
                                );
                            }}
                            className="hidden" // Hide the default file input
                            id="image-upload-5" // Set an id to reference the input
                          />

                          <label
                            htmlFor="image-upload-5"
                            className="h-[100px] w-full bg-bg_gray rounded-lg flex items-center justify-center cursor-pointer"
                          >
                            {!values.productImageURL5 ? (
                              <span className="text-2xl text-gray-500">+</span> // Show plus sign if no image
                            ) : (
                              <div className="h-[100px] object-cover w-full bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={values.productImageURL5}
                                  alt="Uploaded Preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label>Name</label>
                      <Field
                        name="name"
                        type="text"
                        placeholder="Enter Product name"
                        className="w-full outline-none border-primary border p-2 rounded-lg my-2"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-[12px]"
                      />
                    </div>
                    <div className=" grid grid-cols-2 gap-2">
                      <div>
                        <label>Single Price</label>
                        <Field name="currentPrice">
                          {({ field, form }: FieldProps<string>) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Enter Product Price"
                              value={formatCurrency(field.value || "")}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                ); // Extract raw numeric value
                                form.setFieldValue("currentPrice", rawValue);
                              }}
                              className="w-full outline-none border-primary border p-2 rounded-lg my-2"
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="currentPrice"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>
                      <div>
                        <label>Bulk Price</label>
                        <Field name="oldPrice">
                          {({ field, form }: FieldProps<string>) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Enter Product Old Price"
                              value={formatCurrency(field.value || "")}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                ); // Extract raw numeric value
                                form.setFieldValue("oldPrice", rawValue);
                              }}
                              className="w-full outline-none border-primary border p-2 rounded-lg my-2"
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="oldPrice"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>
                    </div>
                    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2 ">
                      <div>
                        <label>Available Quantity</label>
                        <Field
                          name="availableAmount"
                          type="text"
                          placeholder="Enter Product Available Quantity"
                          className="w-full outline-none border-primary border p-2 rounded-lg my-2"
                        />
                        <ErrorMessage
                          name="availableAmount"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>{" "}
                      <div>
                        <label>Product Weight</label>
                        <Field name="productWeight">
                          {({ field, form }: FieldProps<string>) => (
                            <div className="w-full my-2 flex items-center border border-primary rounded-lg overflow-hidden">
                              <input
                                {...field}
                                type="text"
                                placeholder="Enter Weight"
                                value={(field.value || "")}
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  ); // Extract raw numeric value
                                  form.setFieldValue("productWeight", rawValue);
                                }}
                                className="flex-grow p-2 outline-none"
                              />
                              <span className="px-3 bg-gray-100 text-sm text-gray-700 border-l border-primary">
                                kg
                              </span>
                            </div>
                          )}
                        </Field>
                        <ErrorMessage
                          name="productWeight"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label>Category</label>
                      {loadingCategories ? (
                        <p>Loading categories...</p>
                      ) : (
                        <Field
                          as="select"
                          name="category"
                          className="w-full border border-primary p-2 rounded-lg my-2"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            const selectedCategory = categories.find(
                              (cat) => cat.id === e.target.value
                            );
                            setFieldValue("category", e.target.value); // Set the category ID
                            setFieldValue(
                              "selectedCategory",
                              selectedCategory || {}
                            ); // Set the full category object

                            // Set subcategories based on selected category
                            if (selectedCategory) {
                              const relatedSubCategories = categories.filter(
                                (cat) => cat.parentId === selectedCategory.id
                              );
                              setSubCategories(relatedSubCategories);
                            } else {
                              setSubCategories([]);
                            }
                          }}
                        >
                          <option value="" label="Select category" />
                          {categories
                            .filter((category) => !category.parentId) // Top-level categories
                            .map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </Field>
                      )}
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-[12px]"
                      />
                    </div>

                    <div>
                      <label>Description</label>
                      <Field
                        as="textarea"
                        name="description"
                        placeholder="Enter Product Description"
                        className="w-full outline-none border-primary h-[200px] border p-2 rounded-lg my-2"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-[12px]"
                      />
                    </div>

                    <div className="flex items-center gap-2 my-2">
                      <Field type="checkbox" name="isPublish" />
                      <label>Publish Product</label>
                    </div>
                    <div className="flex items-center gap-2 my-2">
                      <Field type="checkbox" name="isFeatured" />
                      <label>Featured Product</label>
                    </div>
                    <div className="flex items-center gap-2 my-2">
                      <Field type="checkbox" name="isTrending" />
                      <label>Trending Product</label>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="mt-4 w-fit py-1 px-4 bg-bg_gray text-p_black rounded-md"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="mt-4 w-fit py-1 px-4 bg-primary text-white rounded-md"
                      >
                        Add Product
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      <div className=" flex fixed bottom-[24px] z-20 right-[24px] ">
        <div className=" relative">
          {isAddMoreOpen && (
            <div className="absolute py-2 right-0 -top-[120px] z-20 mt-2 w-[250px] whitespace-nowrap px-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                className="py-1"
              >
                <ParagraphLink1>Create New Product </ParagraphLink1>
              </div>
              <div className="py-1">
                <ManageCategories onRefetch={onRefetch} />
              </div>
            </div>
          )}{" "}
          <div
            onClick={() => setIsAddMoreOpen(!isAddMoreOpen)}
            className=" p-4 bg-primary cursor-pointer hover:bg-black text-white rounded-lg"
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMore;
