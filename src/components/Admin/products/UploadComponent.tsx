"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, addDoc } from "firebase/firestore"; // Firebase methods
import toast from "react-hot-toast";

type ProductValues = {
  name: string;
  productImageURL1: string;
  productImageURL2: string;
  productImageURL3: string;
  productImageURL4: string;
  productImageURL5: string;
  currentPrice: number;
  oldPrice: number;
  category: string;
  description: string;
  isFeatured: boolean;
};

const initialValues: ProductValues = {
  name: "",
  productImageURL1: "",
  productImageURL2: "",
  productImageURL3: "",
  productImageURL4: "",
  productImageURL5: "",
  currentPrice: 0,
  oldPrice: 0,
  category: "",
  description: "",
  isFeatured: false,
};

function AddMore() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    currentPrice: Yup.number().required("Current price is required"),
    oldPrice: Yup.number().required("Old price is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleImageUpload = async (
    file: File,
    setFieldValue: any,
    fieldName: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "e-shop");

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtipo8fg3/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      setFieldValue(fieldName, data.secure_url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: ProductValues) => {
    try {
      await addDoc(collection(db, "products"), {
        ...values,
        createdAt: new Date(),
      });
      setIsAddProductOpen(false);
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product: ", error);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div>
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 px-6 py-4 rounded-md shadow-lg bg-white h-[500px] overflow-hidden overflow-y-auto ring-1 ring-black ring-opacity-5">
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div>
                    <label htmlFor="name">Product Name</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full mb-4"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500"
                    />

                    <label>Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file)
                          handleImageUpload(
                            file,
                            setFieldValue,
                            "productImageURL1"
                          );
                      }}
                      className="w-full mb-4"
                    />

                    <div className="flex gap-4 mb-4">
                      {/* Replace with dynamic previews */}
                      <Field
                        type="text"
                        id="productImageURL1"
                        name="productImageURL1"
                        className="w-full mb-4 hidden"
                      />
                      <img
                        src={initialValues.productImageURL1}
                        alt="Preview"
                        className="h-[50px] w-[50px] object-cover"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Add Product"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsAddProductOpen(true)}
        className="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Add Product
      </button>
    </div>
  );
}

export default AddMore;
