"use client";

import React, { useState, useEffect } from "react";
import { Header3, Header4, Header5, ParagraphLink1 } from "@/components/Text";
import { db } from "@/lib/firebase"; // Firestore setup
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";

interface ModalProps {
  blog: any;
  onClose: () => void;
}

type BlogValues = {
  title: string;
  blogImageURL1: string;
  blogImagePublicId1: string;
  description: string;
};

const BlogModal: React.FC<ModalProps> = ({ blog, onClose }) => {
  const [isloading, setIsLoading] = useState(false);

  const initialValues: BlogValues = {
    title: blog?.title || "", 
    blogImageURL1: blog?.blogImageURL1 || "",
    blogImagePublicId1: blog?.blogImagePublicId1 || "",
    description: blog?.description || "",
  };


  const [formData, setFormData] = useState(initialValues);

  const validationSchema = Yup.object({
    title: Yup.string().required("Blog title is required"),
    blogImageURL1: Yup.string().required("Current image is required"),
    description: Yup.string().required("Blog detail is required"),
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


  const handleSave = async (values: BlogValues) => {
    setIsLoading(true);

    try {
      if (blog?.id) {
        // If blog.id exists, update the existing blog
        const blogRef = doc(db, "blogs", blog.id);
        await updateDoc(blogRef, {
          ...values,
          updatedAt: new Date(),
        });
      } else {
        // If no blog.id, create a new blog
        await addDoc(collection(db, "blogs"), {
          ...values,
          createdAt: new Date(),
        });
      }
      setIsLoading(false);
      onClose(); // Close the modal on success
      window.location.reload(); // Optionally refresh the page
    } catch (error) {
      console.error("Error saving blog: ", error);
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white relative rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6   ">
        {isloading && (
          <div className=" absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <Header5 className="text-xl font-bold mb-4">Blog Post</Header5>
        <div className="space-y-4 max-h-[400px] overflow-hidden overflow-y-auto scrollbar-hide">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {({ values, setFieldValue }) => (
              <Form className=" space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Enter blog title"
                    className="w-full outline-none border-primary border p-2 rounded-lg my-2"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-[12px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Images
                  </label>
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
                            "blogImageURL1",
                            values.blogImagePublicId1 // Pass the public ID of the old image
                          );
                      }}
                      className="hidden" // Hide the default file input
                      id="image-upload-1" // Set an id to reference the input
                    />

                    <label
                      htmlFor="image-upload-1"
                      className="h-[150px] w-full bg-bg_gray rounded-lg flex items-center justify-center cursor-pointer"
                    >
                      {!values.blogImageURL1 ? (
                        <span className="text-2xl text-gray-500">+</span> // Show plus sign if no image
                      ) : (
                        <div className="h-[150px] object-cover w-full bg-bg_gray rounded-lg overflow-hidden">
                          <img
                            src={values.blogImageURL1}
                            alt="Uploaded Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Blog Detail
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Enter Blog Detail"
                    className="w-full outline-none h-[700px] border-primary border p-2 rounded-lg my-2"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-[12px]"
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-primary -600 rounded-md hover:bg-black -700"
                  >
                    Save
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

export default BlogModal;
