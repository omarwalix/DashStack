"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

function NavBar() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCurrentUser = () => {
    if (user) return user;
    if (isClient) {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  };

  const currentUser = getCurrentUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-end px-4 sm:px-6 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-medium text-gray-900 text-sm sm:text-base">
            {currentUser?.userName || "userName"}
          </p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <Link href="/Profile">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow cursor-pointer">
            {currentUser?.profileImageUrl ? (
              <img
                src={currentUser.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                {currentUser?.userName?.charAt(0) || "U"}
              </div>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
