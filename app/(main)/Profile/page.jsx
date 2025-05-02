"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function ProfilePage() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const handleImageClick = () => {
    if (currentUser?.profileImageUrl) {
      setShowImageModal(true);
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setShowImageModal(false);
    document.body.style.overflow = "auto";
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/** Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={handleImageClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentUser.profileImageUrl ? (
                  <img
                    src={currentUser.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-4xl font-bold">
                    {currentUser.userName?.charAt(0) || "U"}
                  </div>
                )}
              </motion.div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <p className="text-blue-100 mt-1">@{currentUser.userName}</p>
              </div>
            </div>
          </div>

          {/** Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="text-gray-800 font-medium">
                        {currentUser.firstName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="text-gray-800 font-medium">
                        {currentUser.lastName || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-gray-800 font-medium">
                        @{currentUser.userName || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800 font-medium">
                        {currentUser.email || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/Products"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/** Add Animation */}
      <AnimatePresence>
        {showImageModal && currentUser.profileImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={closeModal}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-xl"
                layoutId="profile-image-container"
              >
                <motion.img
                  src={currentUser.profileImageUrl}
                  alt="Profile Preview"
                  className="w-full h-auto max-h-[80vh] object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfilePage;
