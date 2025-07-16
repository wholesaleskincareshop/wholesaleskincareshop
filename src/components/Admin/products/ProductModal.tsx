"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { db } from "@/lib/firebase"; // Firestore setup
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore"; // Firebase methods

interface Product {
  id: any;
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
  sub_category: string;
  selectedCategory: any;
  selectedSubCategory: any;
  description: string;
  isFeatured: boolean;
  isTrending: boolean;
  isElite: boolean;
  isSpecial: boolean;
  isBudget: boolean;
  isPublish: boolean;
}

interface ModalProps {
  product: Product;
  onClose: () => void;
}

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
  sub_category: string;
  selectedCategory: any;
  selectedSubCategory: any;
  description: string;
  isFeatured: boolean;
  isTrending: boolean;
  isElite: boolean;
  isSpecial: boolean;
  isBudget: boolean;
  isPublish: boolean;
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

const ProductModal: React.FC<ModalProps> = ({ product, onClose }) => {
  const [isloading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const initialValues: ProductValues = {
    name: product.name,
    productImageURL1: product.productImageURL1,
    productImagePublicId1: product.productImagePublicId1,
    productImageURL2: product.productImageURL2,
    productImagePublicId2: product.productImagePublicId2,
    productImageURL3: product.productImageURL3,
    productImagePublicId3: product.productImagePublicId3,
    productImageURL4: product.productImageURL4,
    productImagePublicId4: product.productImagePublicId4,
    productImageURL5: product.productImageURL5,
    productImagePublicId5: product.productImagePublicId5,
    currentPrice: product.currentPrice,
    oldPrice: product.oldPrice,
    availableAmount: product.availableAmount,
    productWeight: product.productWeight,
    category: product.category,
    sub_category: product.sub_category,
    selectedCategory: product.selectedCategory,
    selectedSubCategory: product.selectedSubCategory,
    description: product.description,
    isFeatured: product.isFeatured,
    isTrending: product.isTrending,
    isElite: product.isElite,
    isSpecial: product.isSpecial,
    isBudget: product.isBudget,
    isPublish: product.isPublish,
  };

  const [formData, setFormData] = useState(initialValues);

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

        // Preload subcategories if editing a product
        if (product?.category) {
          const selectedCategory = categoriesData.find(
            (cat) => cat.id === product.category
          );
          if (selectedCategory) {
            const relatedSubCategories = categoriesData.filter(
              (cat) => cat.parentId === selectedCategory.id
            );
            setSubCategories(relatedSubCategories);
          }
        }
      } catch (error) {
        console.error("Error fetching categories: ", error);
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [product]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    currentPrice: Yup.number().required("Current price is required"),
    oldPrice: Yup.number().required("Old price is required"),
    availableAmount: Yup.number().required("Avaliable quantity is required"),
    productWeight: Yup.number().required("Avaliable quantity is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
  });

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: ProductValues) => {
    setIsLoading(true);

    try {
      const productRef = doc(db, "products", product.id); // Firestore document reference
      await updateDoc(productRef, {
        ...values,
        updatedAt: new Date(), // Optional timestamp for tracking updates
      });
      setIsLoading(false);
      onClose(); // Close the modal on success
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error updating product: ", error);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const productRef = doc(db, "products", product.id); // Firestore document reference
      await deleteDoc(productRef); // Firestore method to delete the document
      setIsLoading(false);
      onClose(); // Close the modal on success
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error deleting product: ", error);
      setIsLoading(false);
    }
  };
  const formatCurrency = (value: any) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    return `₦ ${Number(numericValue).toLocaleString()}`; // Format as currency
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white relative rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6   ">
        {isloading && (
          <div className=" absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <div>
          <div className=" flex justify-between">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <button onClick={() => setIsDeleteOpen(true)}>
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className=" h-[500px] overflow-hidden overflow-y-auto scrollbar-hide">
          {isDeleteOpen && (
            <div className="  flex flex-col items-center justify-center bg-white border p-4">
              <p>Are you sure you want to delete this product??</p>
              <div className=" pt-4 flex gap-4 items-center">
                {" "}
                <button
                  className=" py-2 px-4 bg-gray-300 rounded-lg"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </button>{" "}
                <button
                  className=" py-2 px-4 bg-black text-white rounded-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
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
                    <label>Current Price</label>
                    <Field name="currentPrice">
                      {({ field, form }: FieldProps<string>) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Product Price"
                          value={formatCurrency(field.value || "")}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, ""); // Extract raw numeric value
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
                            const rawValue = e.target.value.replace(/\D/g, ""); // Extract raw numeric value
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
                <div className=" grid grid-cols-2 gap-2 ">
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
                    <label>Product Weight/Packaging Cost</label>
                    <Field name="productWeight">
                      {({ field, form }: FieldProps<string>) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Packaging Price"
                          value={formatCurrency(field.value || "")}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, ""); // Extract raw numeric value
                            form.setFieldValue("productWeight", rawValue);
                          }}
                          className="w-full outline-none border-primary border p-2 rounded-lg my-2"
                        />
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
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
                  <label>Sub Category</label>
                  {loadingCategories ? (
                    <p>Loading sub categories...</p>
                  ) : (
                    <Field
                      as="select"
                      name="sub_category"
                      className="w-full border border-primary p-2 rounded-lg my-2"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedSubCategory = subCategories.find(
                          (subCat) => subCat.id === e.target.value
                        );
                        setFieldValue("sub_category", e.target.value); // Optional: Store ID for convenience
                        setFieldValue(
                          "selectedSubCategory",
                          selectedSubCategory || {}
                        ); // Store the full object
                      }}
                    >
                      <option value="" label="Select sub category" />
                      {subCategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
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
                {/* <div className="flex items-center gap-2 my-2">
                  <Field type="checkbox" name="isElite" />
                  <label>Single Products</label>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <Field type="checkbox" name="isSpecial" />
                  <label>Special Product</label>
                </div> */}
                {/* <div className="flex items-center gap-2 my-2">
                  <Field type="checkbox" name="isBudget" />
                  <label>Wholesale and Bulk Products</label>
                </div> */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="mt-4 w-fit py-1 px-4 bg-bg_gray text-p_black rounded-md"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="mt-4 w-fit py-1 px-4 bg-primary text-white rounded-md"
                  >
                    Update Product
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
