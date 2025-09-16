import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UseUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    setUsersError(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const result = await apiService.getData("users", token);
        setUsers(result);
        setUsersError(null);
        setShowError(false);
      } catch (error) {
        console.error(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const refreshUsers = () => setRefresh((prev) => !prev);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        usersError,
        showError,
        setShowError,
        refreshUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
