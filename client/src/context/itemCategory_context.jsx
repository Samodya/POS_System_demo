import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const itemCategoriesContext = createContext();

export const UseitemCategoriesContext = () => useContext(itemCategoriesContext);

export const itemCategoriesContextProvider = ({ children }) => {
  const [itemCategories, setItemCategories] = useState([]);
  const [itemCategoriesError, setItemCategoriesError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    setSaleItemError(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchItemCategoies = async () => {
      setLoading(true);

      try {
        const result = await apiService.getData("item-category", token);
        setItemCategories(result);
        setItemCategoriesError(null);
        setShowError(false);
      } catch (error) {
        console.error(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemCategoies();
  }, [refresh, token]);

  const refreshItemCategories = () => setRefresh((prev) => !prev);

  return (
    <SaleItemsContext.Provider
      value={{
        itemCategories,
        loading,
        itemCategoriesError,
        showError,
        setShowError,
        refreshItemCategories,
      }}
    >
      {children}
    </SaleItemsContext.Provider>
  );
};
