import Cookies from "js-cookie";
const backendUrl = import.meta.env.VITE_SERVER_URL;

export const register = async (formData) => {
  try {
    const res = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success === false) {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (formData) => {
  try {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      Cookies.set("access_token", data.token);
      localStorage.setItem("access_token", data.token);
    } else {
      throw new Error(
        data.message || "An unexpected error occurred. Please try again."
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${backendUrl}/auth/logout`, {
      credentials: "include",
    });

    if (res.ok) {
      Cookies.remove("access_token");
      localStorage.removeItem("access_token");
    } else {
      console.error("Logout failed:", res.status);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
