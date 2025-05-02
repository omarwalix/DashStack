"use client";
import {
  ShoppingBagIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { FaArrowLeft } from "react-icons/fa";
import { MdSpaceDashboard, MdMenu, MdClose } from "react-icons/md";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

function SideBar() {
  const router = useRouter();
  const { logout } = useAuth();
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/Login");
      console.log("Logout Done");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`fixed z-50 p-2 rounded-md bg-gray-800 text-white transition-all duration-300 ${
          isOpen ? "left-[15rem] lg:left-60" : "left-4"
        } top-4`}
      >
        {isOpen ? <FaArrowLeft size={20} /> : <MdMenu size={24} />}
      </button>

      <div
        className={`flex flex-col h-screen bg-gray-800 text-white p-4 fixed left-0 top-0 transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-[70px]"
        }`}
      >
        <div
          className={`text-center gap-2 p-4 mb-5 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <p className="text-2xl font-semibold truncate">
            Dash<span className="text-blue-600">Stack</span>
          </p>
        </div>

        <div className="flex items-center justify-center p-3 mb-6 border border-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <MdSpaceDashboard className="h-5 w-5 text-white min-w-[20px]" />
            <span className={`font-semibold ${isOpen ? "block" : "hidden"}`}>
              Dashboard
            </span>
          </div>
        </div>

        <Link
          href="/Products"
          className={`${
            isOpen
              ? "flex items-center gap-3 p-3 mb-4 rounded-lg bg-gray-700 hover:bg-gray-600 "
              : "justify-center flex items-center gap-3 p-3 mb-4 rounded-lg bg-gray-700 hover:bg-gray-600 "
          }`}
        >
          <ShoppingBagIcon className="h-5 w-5 text-gray-400 min-w-[20px]" />
          <span className={`${isOpen ? "block" : "hidden"}`}>Products</span>
        </Link>

        <Link href="/Profile" className="mt-auto pt-4 border-t border-gray-700">
          <p className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer">
            <UserIcon className="h-5 w-5 min-w-[20px]" />
            <span className={`${isOpen ? "block" : "hidden"}`}>Profile</span>
          </p>
        </Link>
        <div
          className=" pt-4 border-t border-gray-700"
          onClick={() =>
            openModal({
              title: "Logout",
              message: "Are you sure you want to Logout?",
              onConfirm: handleLogout,
            })
          }
        >
          <p className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer">
            <ArrowLeftOnRectangleIcon className="h-5 w-5 min-w-[20px]" />
            <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default SideBar;
