"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUploadWithPreview from "@/components/ImagePicker";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Check form validity whenever form data or image changes
  useEffect(() => {
    const isValid =
      formData.name.trim() !== "" &&
      formData.price.trim() !== "" &&
      image instanceof File;
    setIsFormValid(isValid);
  }, [formData, image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file) => {
    if (file instanceof File) {
      setImage(file);
    } else {
      console.error("Received non-file object:", file);
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || "";
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("price", formData.price);
      formDataToSend.append("image", image, image.name);

      const response = await fetch("https://vica.website/api/items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      router.push("/Products?add_success=true");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/Products");
  };

  return (
    <div>
      <div className="my-8">
        <div className="text-black font-bold text-3xl">Add Product</div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse items-center lg:flex-row lg:justify-between lg:items-center w-full">
        <div className="w-full lg:w-5/12">
          <form onSubmit={handleSubmit}>
            <div className="mt-6 lg:mb-6">
              <label
                htmlFor="name"
                className="block font-medium text-gray-700 mb-2"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product Name"
              />
            </div>
            <div className="mt-6 mb-6">
              <label
                htmlFor="price"
                className="block font-medium text-gray-700 mb-2"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Price"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center min-w-[100px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`px-6 py-2 text-white font-medium rounded-md transition-colors flex items-center justify-center min-w-[100px] ${
                  !isFormValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                } ${isLoading ? "bg-blue-400" : ""}`}
              >
                {isLoading ? (
                  <SyncLoader color="#fff" size={7} speedMultiplier={1} />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center w-full lg:w-6/12">
          <ImageUploadWithPreview onImageChange={handleImageChange} />
        </div>
      </div>
    </div>
  );
}
