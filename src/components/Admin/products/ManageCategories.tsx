import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { ParagraphLink1, ParagraphLink2 } from "@/components/Text";

interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

interface ManageCategoriesProps {
  onRefetch: () => void;
}

const ManageCategories: React.FC<ManageCategoriesProps> = ({ onRefetch }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryName, setCategoryName] = useState("");
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
        createdAt: new Date(),
        parentId: null, // You can omit this line if you're removing parentId completely
      });

      setIsLoading(false);
      setIsAddCategoryOpen(false);
      setCategoryName("");
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

  return (
    <div>
      <div onClick={() => setIsAddCategoryOpen(true)} className="py-1">
        <ParagraphLink1>Create New Category</ParagraphLink1>
      </div>

      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 px-6 py-4 relative rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <ParagraphLink2 className="text-lg font-semibold">
                Create Category
              </ParagraphLink2>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Category name"
                className="w-full outline-none border-primary border p-2 rounded-lg my-2"
              />
              {/* Removed parent selection */}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="mt-4 w-fit py-1 px-4 bg-bg_gray rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleCreateCategory}
                className="mt-4 w-fit py-1 px-4 bg-primary text-white rounded-md"
                disabled={isLoading}
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
