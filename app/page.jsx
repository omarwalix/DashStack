"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const isLoggedIn = user || storedUser;

    if (isLoggedIn) {
      router.replace("/Products");
    } else {
      router.replace("/Login");
    }
  }, [user, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
