"use client";
import { Suspense, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import {
  FaRegEdit,
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleDoubleRight,
  FaAngleRight,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useModal } from "@/context/ModalContext";
import { SyncLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";


function ProductsContent() {
  const DeleteNotify = () => toast.success("Delete successfully");
  const UpdateNotify = () => toast.success("Product Update Successfully");
  const AddNotify = () => toast.success("Add Product Successfully");
  const { openModal } = useModal();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const searchParams = useSearchParams();
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch("https://vica.website/api/items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired - please login again");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setFilteredData(result);

      if (searchParams.get("edit_success")) {
        UpdateNotify();
        window.history.replaceState(null, "", "/Products");
      }
      if (searchParams.get("add_success")) {
        AddNotify();
        window.history.replaceState(null, "", "/Products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const results = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm) ||
        item.price.toString().includes(searchTerm)
    );
    setFilteredData(results);
    setCurrentPage(1); 
    setSelectedProducts([]);
    setIsAllSelected(false);
  }, [searchTerm, data]);

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    const currentProductIds = getCurrentProducts().map((p) => p.id);
    if (isAllSelected) {
      setSelectedProducts((prev) =>
        prev.filter((id) => !currentProductIds.includes(id))
      );
    } else {
      setSelectedProducts((prev) => [
        ...new Set([...prev, ...currentProductIds]),
      ]);
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSelectAllPages = () => {
    if (selectedProducts.length === filteredData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredData.map((p) => p.id));
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortedData = () => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (sortConfig.key === "price") {
          const priceA = parseFloat(a.price);
          const priceB = parseFloat(b.price);
          return sortConfig.direction === "ascending"
            ? priceA - priceB
            : priceB - priceA;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1" />;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  const getCurrentProducts = () => {
    const sortedData = getSortedData();
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return sortedData.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (productId) => {
    setDeletingId(productId);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `https://vica.website/api/items/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setData((prevData) =>
        prevData.filter((product) => product.id !== productId)
      );
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
      DeleteNotify();
      if (getCurrentProducts().length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const deletePromises = selectedProducts.map((productId) =>
        fetch(`https://vica.website/api/items/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const responses = await Promise.all(deletePromises);
      const allSuccessful = responses.every((response) => response.ok);

      if (!allSuccessful) {
        throw new Error("Some deletions failed");
      }

      setData((prevData) =>
        prevData.filter((product) => !selectedProducts.includes(product.id))
      );
      setSelectedProducts([]);
      setIsAllSelected(false);
      DeleteNotify();

      if (
        getCurrentProducts().length <= selectedProducts.length &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelete = (productId) => {
    openModal({
      title: "Delete",
      message: "Are you sure you want to delete the product?",
      onConfirm: () => handleDelete(productId),
    });
  };

  const confirmBulkDelete = () => {
    openModal({
      title: "Delete Selected",
      message: `Are you sure you want to delete ${selectedProducts.length} selected product(s)?`,
      onConfirm: handleBulkDelete,
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="#0000FF" size={15} speedMultiplier={1} />
      </div>
    );

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  const currentProducts = getCurrentProducts();
  const totalPages = Math.ceil(filteredData.length / productsPerPage);

  return (
    <div className="z-0 pb-10">
      <div className="flex justify-between items-center my-8">
        <div className="text-black font-bold text-3xl">Manage Products</div>
        <div className="flex items-center gap-4">
          {selectedProducts.length > 0 && (
            <button
              onClick={confirmBulkDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              disabled={deletingId !== null}
            >
              <FaTrash className="text-lg" />
              Delete Selected ({selectedProducts.length})
            </button>
          )}
          <Link
            href="/Products/Add"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <FiPlus className="text-lg" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {filteredData.length > productsPerPage && (
            <button
              onClick={handleSelectAllPages}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedProducts.length === filteredData.length
                ? "Clear All"
                : `Select All (${filteredData.length})`}
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Sort by:</span>
            <select
              onChange={(e) => requestSort(e.target.value)}
              value={sortConfig.key}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length > 0 &&
                    getCurrentProducts().every((p) =>
                      selectedProducts.includes(p.id)
                    )
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("id")}
              >
                <div className="flex items-center">#{getSortIcon("id")}</div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  Product Name
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("price")}
              >
                <div className="flex items-center">
                  Price
                  {getSortIcon("price")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/Products/Edit/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaRegEdit className="text-center h-7 w-7 cursor-pointer" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? (
                          <FaSpinner className="text-center h-7 w-7 cursor-pointer animate-spin" />
                        ) : (
                          <AiOutlineDelete className="text-center h-7 w-7 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No products found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            {selectedProducts.length > 0 && (
              <span>{selectedProducts.length} selected</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaAngleLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaAngleRight />
            </button>
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}


export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="#0000FF" size={15} speedMultiplier={1} />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}