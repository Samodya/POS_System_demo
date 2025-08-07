import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Cookies from "js-cookie";

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      dispatch({ type: "LOGOUT" });

      // Remove authentication data
      Cookies.remove("user"); 
      Cookies.remove("userId");
      Cookies.remove("username");
      Cookies.remove("role");
      Cookies.remove("token");
      Cookies.remove("email");
      
    } catch (err) {
      setError("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};
