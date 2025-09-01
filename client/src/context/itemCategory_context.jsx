import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const ItemCategoriesContext = createContext();

export const UseitemCategoriesContext = () => useContext(ItemCategoriesContext);

export const ItemCategoriesContextProvider = ({ children }) => {
    const [itemCategories, setItemCategories] = useState([]);
    const [itemCategoriesError, setItemCategoriesError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const token = Cookies.get("token");
  
    const handleError = (error) => {
      const message = error?.message || "Something went wrong";
      setItemCategoriesError(message);
      setShowError(true);
    };
  
    useEffect(() => {
      const fetchItemCategoies = async () => {
        setLoading(true);
  
        try {
          const result = await apiService.getData("item-category", token);
          if (!result) {
            throw new Error('No data returned from API');
          }
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
    <ItemCategoriesContext.Provider
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
    </ItemCategoriesContext.Provider>
  );
};