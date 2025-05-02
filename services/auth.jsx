"use client";
import Cookies from "js-cookie";

export const login = async (email, password) => {
  try {
    const response = await fetch("https://vica.website/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const { token, user } = await response.json();

    console.log(user.user_name);

    localStorage.setItem("token", token);

    // Set cookie
    Cookies.set("user_token", token, {
      expires: 1, // 1 day
      secure: true,
      sameSite: "strict",
    });

    // Get cookie
    const theToken = Cookies.get("user_token");

    console.log(theToken);
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const theToken = Cookies.get("user_token");
    const response = await fetch("https://vica.website/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${theToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
  localStorage.removeItem("token");
  Cookies.remove("user_token");
};
