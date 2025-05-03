"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import ImageUploadWithPreview from "@/components/ImagePicker";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image_url: "",
  });
  const [initialProduct, setInitialProduct] = useState({
    name: "",
    price: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Extract ID from URL
  const extractIdFromPath = () => {
    const parts = pathname.split("/");
    return parts[parts.length - 1];
  };

  const productId = extractIdFromPath();

  // Fetch product data based on ID
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await fetch(
          `https://vica.website/api/items/${productId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired - please login again");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
        setInitialProduct(data);
        setImageFile(data.image_url);
      } catch (error) {
        toast.error("This item has been removed.");
        console.error("Error fetching product:", error);
        router.push("/Products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  // Check for changes
  useEffect(() => {
    const checkForChanges = () => {
      const nameChanged = product.name !== initialProduct.name;
      const priceChanged = product.price !== initialProduct.price;
      const imageChanged =
        imageFile instanceof File ||
        (typeof imageFile === "string" &&
          imageFile !== initialProduct.image_url);

      setHasChanges(nameChanged || priceChanged || imageChanged);
    };

    if (initialProduct.name) {
      // Only check after initial data is loaded
      checkForChanges();
    }
  }, [product, imageFile, initialProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProduct((prev) => ({ ...prev, image_url: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !hasChanges) return;
    setSaving(true);

    try {
      const token = localStorage.getItem("token") || "";
      const formData = new FormData();

      formData.append("name", product.name.trim());
      formData.append("price", product.price);

      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      }

      formData.append("_method", "PUT");

      const response = await fetch(
        `https://vica.website/api/items/${productId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      router.push("/Products?edit_success=true");
    } catch (error) {
      toast.error(error.message || "Failed to update product");
      console.error("Error updating product:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/Products");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="#0000FF" size={15} speedMultiplier={1} />
      </div>
    );
  }

  return (
    <div>
      <div className="my-8">
        <div className="text-black font-bold text-3xl">Edit Product</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col-reverse items-center lg:flex-row lg:justify-between lg:items-center w-full">
          <div className="mt-6 w-full lg:w-5/12">
            <div className="mb-6">
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
                value={product.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product Name"
                required
              />
            </div>
            <div className="mb-6">
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
                value={product.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Price"
                required
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
                disabled={!hasChanges || saving}
                className={`px-6 py-2 text-white font-medium rounded-md transition-colors flex items-center justify-center min-w-[100px] ${
                  !hasChanges
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                } ${saving ? "bg-blue-400" : ""}`}
              >
                {saving ? (
                  <SyncLoader color="#fff" size={7} speedMultiplier={1} />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center w-full lg:w-6/12">
            <ImageUploadWithPreview
              onImageChange={handleImageChange}
              initialImage={product.image_url}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;
