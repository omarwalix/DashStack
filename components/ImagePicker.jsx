"use client";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { useState, useRef, useEffect } from "react";

function ImageUploadWithPreview({ onImageChange, initialImage }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      onImageChange(file);
    } else {
      onImageChange(null);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageChange(null);
  };

  return (
    <div className="flex items-center justify-center w-6/12">
      <label
        onClick={handleClick}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          preview
            ? "border-gray-200 bg-white"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            <div className="flex justify-center items-center w-full h-full py-3 rounded-md">
              <img
                src={preview}
                alt="Preview"
                className="object-cover h-full rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
            >
              <IoMdCloseCircle className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-5">
            <IoCloudUploadOutline className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (MAX. 5MB)
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          onClick={(e) => e.stopPropagation()}
        />
      </label>
    </div>
  );
}

export default ImageUploadWithPreview;
