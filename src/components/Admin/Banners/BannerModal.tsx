"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { Header5 } from "@/components/Text";

interface ModalProps {
  banner?: any; // existing banner if editing
  onClose: () => void;
}

type BannerValues = {
  name: string;
  bannerImageURL: string;
  bannerImagePublicId: string;
};

const BannerModal: React.FC<ModalProps> = ({ banner, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: BannerValues = {
    name: banner?.name || "",
    bannerImageURL: banner?.bannerImageURL || "",
    bannerImagePublicId: banner?.bannerImagePublicId || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Banner name is required"),
    bannerImageURL: Yup.string().required("Banner image is required"),
  });

  const handleImageUpload = async (
    file: File,
    setFieldValue: any,
    oldImagePublicId?: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "e-shop");

    try {
      setIsLoading(true);

      // Delete old image from Cloudinary
      if (oldImagePublicId) {
        await fetch("/api/delete-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: oldImagePublicId }),
        });
      }

      // Upload new image
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setFieldValue("bannerImageURL", data.secure_url);
      setFieldValue("bannerImagePublicId", data.public_id);
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (values: BannerValues) => {
    setIsLoading(true);

    try {
      if (banner?.id) {
        const bannerRef = doc(db, "banners", banner.id);
        await updateDoc(bannerRef, {
          ...values,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "banners"), {
          ...values,
          createdAt: new Date(),
        });
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving banner: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <Header5 className="text-xl font-semibold mb-4">
          {banner ? "Edit Banner" : "Add New Banner"}
        </Header5>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4">
              <div>
                <label className="block font-medium">Banner Name</label>
                <Field
                  name="name"
                  className="border w-full p-2 rounded"
                  placeholder="Enter banner name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleImageUpload(
                      e.target.files[0],
                      setFieldValue,
                      values.bannerImagePublicId
                    )
                  }
                />
                {values.bannerImageURL && (
                  <img
                    src={values.bannerImageURL}
                    alt="Banner"
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
                <ErrorMessage
                  name="bannerImageURL"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BannerModal;
