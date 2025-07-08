import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Firestore setup
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore"; // Firebase methods
import toast from "react-hot-toast";
import { ParagraphLink1, ParagraphLink2 } from "@/components/Text";

interface Category {
  id: string;
  name: string;
  parentId?: string | null; // Nullable for root categories
  createdAt: Date;
}

interface ManageCategoriesProps {
  onRefetch: () => void; // Define the type of the prop
}

const ManageCategories: React.FC<ManageCategoriesProps> = ({ onRefetch }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "category"), {
        name: categoryName,
        parentId: selectedParent || null, // Set parentId if selected
        createdAt: new Date(),
      });
      setIsLoading(false);
      setIsAddCategoryOpen(false);
      setCategoryName(""); // Reset input
      setSelectedParent(null); // Reset parent selection
      toast.success("Category created successfully!");
      onRefetch();
    } catch (error) {
      console.error("Error adding category: ", error);
      toast.error("Failed to create category!");
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // Check if the category has subcategories
      const subcategoriesQuery = query(
        collection(db, "category"),
        where("parentId", "==", categoryId)
      );
      const subcategoriesSnapshot = await getDocs(subcategoriesQuery);

      if (!subcategoriesSnapshot.empty) {
        toast.error(
          "Cannot delete category with subcategories. Delete subcategories first."
        );
        return;
      }

      await deleteDoc(doc(db, "category", categoryId));
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast.error("Failed to delete category!");
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    try {
      await deleteDoc(doc(db, "category", subcategoryId));
      setCategories(
        categories.filter((category) => category.id !== subcategoryId)
      );
      toast.success("Subcategory deleted successfully!");
    } catch (error) {
      console.error("Error deleting subcategory: ", error);
      toast.error("Failed to delete subcategory!");
    }
  };

  return (
    <div>
      <div onClick={() => setIsAddCategoryOpen(true)} className="py-1">
        <ParagraphLink1>Create New Category </ParagraphLink1>
      </div>
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 px-6 py-4 relative rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {/* <div className="">
              <ParagraphLink2 className="text-xl font-semibold">Categories</ParagraphLink2>
              {loadingCategories ? (
                <p>Loading...</p>
              ) : (
                <ul>
                  {categories
                    .filter((category) => !category.parentId)
                    .map((category) => (
                      <li key={category.id} className="mb-4">
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="py-1 px-3 bg-red-500 text-white rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                        <ul className="pl-4">
                          {categories
                            .filter((sub) => sub.parentId === category.id)
                            .map((subcategory) => (
                              <li
                                key={subcategory.id}
                                className="flex justify-between"
                              >
                                <span>{subcategory.name}</span>
                                <button
                                  onClick={() =>
                                    handleDeleteSubcategory(subcategory.id)
                                  }
                                  className="py-1 px-3 bg-red-500 text-white rounded-md"
                                >
                                  Delete
                                </button>
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              )}
            </div> */}

            <div className=" flex flex-col gap-2">
              <ParagraphLink2 className="text-lg font-semibold">
                Create Category
              </ParagraphLink2>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)} // Update state
                placeholder="Enter Category name"
                className="w-full outline-none border-primary border p-2 rounded-lg my-2"
              />
              <select
                value={selectedParent || ""}
                onChange={(e) => setSelectedParent(e.target.value || null)} // Update parentId
                className="w-full outline-none border-primary border p-2 rounded-lg my-2"
              >
                <option value="">No Parent (Root Category)</option>
                {categories
                  .filter((category) => !category.parentId) // Exclude categories with parentId
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="mt-4 w-fit py-1 px-4 bg-bg_gray  rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleCreateCategory}
                className="mt-4 w-fit py-1 px-4 bg-primary text-white rounded-md"
                disabled={isLoading} // Prevent multiple submissions
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
