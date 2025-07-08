import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  writeBatch, // Import writeBatch
  query,
  where,
} from "firebase/firestore";
import { ParagraphLink2 } from "@/components/Text";
import toast from "react-hot-toast";

type Category = {
  id: string;
  name: string;
  parentId: string;
};

interface CategoryEditorProps {
  onRefetch: any; // Define the type of the prop
}

const CategoryEditor: React.FC<CategoryEditorProps> = ({ onRefetch }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "category"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSaveAll = async () => {
    try {
      const batch = writeBatch(db); // Create the batch
      categories.forEach((category) => {
        const categoryRef = doc(db, "category", category.id);
        batch.update(categoryRef, { name: category.name });
      });

      // Commit the batch
      await batch.commit();

      onRefetch();
      // After saving, close the modal
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const categoryRef = doc(db, "category", id);
      // Check if the category has subcategories
      const subcategoriesQuery = query(
        collection(db, "category"),
        where("parentId", "==", id)
      );
      const subcategoriesSnapshot = await getDocs(subcategoriesQuery);

      if (!subcategoriesSnapshot.empty) {
        toast.error(
          "Cannot delete category with subcategories. Delete subcategories first."
        );
        return;
      }

      await deleteDoc(categoryRef);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      onRefetch();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div>
      <button
        className="px-2 py-2 mr-4 bg-white rounded-lg border"
        onClick={() => setIsEditing(!isEditing)}
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>

      {isEditing && (
        <div className="fixed inset-0 z-[99] bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 shadow-md border rounded-md relative w-96">
            <button
              className="absolute top-2 right-2 px-2 py-1"
              onClick={() => setIsEditing(false)}
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              
            </button>
            <ParagraphLink2 className="font-bold mb-4">
              Category List
            </ParagraphLink2>
            <div className=" max-h-[400px] overflow-hidden overflow-y-auto scrollbar-hide">
              {categories
                .filter((category) => !category.parentId) // Get parent categories
                .map((parentCategory) => (
                  <div key={parentCategory.id}>
                    {/* Render Parent Category */}
                    <div className="p-2 flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={parentCategory.name}
                          onChange={(e) =>
                            setCategories((prev) =>
                              prev.map((cat) =>
                                cat.id === parentCategory.id
                                  ? { ...cat, name: e.target.value }
                                  : cat
                              )
                            )
                          }
                          className="border rounded-lg px-2 py-1 w-full mr-2"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 text-gray-500"
                          onClick={() => handleDelete(parentCategory.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
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

                    {/* Render Subcategories */}
                    {categories
                      .filter(
                        (subCategory) =>
                          subCategory.parentId === parentCategory.id
                      )
                      .map((subCategory) => (
                        <div
                          key={subCategory.id}
                          className="p-2 flex justify-between items-center pl-6"
                        >
                          <div className="flex gap-2 items-center">
                            <div> - </div>
                            <input
                              type="text"
                              value={subCategory.name}
                              onChange={(e) =>
                                setCategories((prev) =>
                                  prev.map((cat) =>
                                    cat.id === subCategory.id
                                      ? { ...cat, name: e.target.value }
                                      : cat
                                  )
                                )
                              }
                              className="border rounded-lg px-2 py-1 w-full mr-2"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="px-2 py-1 text-gray-500"
                              onClick={() => handleDelete(subCategory.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-4"
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
                      ))}
                  </div>
                ))}
            </div>

            <div className="mt-4">
              <button
                className="px-4 py-1 bg-black text-white rounded-lg"
                onClick={handleSaveAll}
              >
                <ParagraphLink2 className=" text-[14px]">
                  Save All
                </ParagraphLink2>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryEditor;
