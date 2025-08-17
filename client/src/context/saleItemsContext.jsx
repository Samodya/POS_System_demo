import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const SaleItemsContext = createContext();

export const UseSaleItemsContext = () => useContext(SaleItemsContext);

export const SaleItemsContextProvider = ({ children }) => {
  const [saleItems, setSaleItem] = useState([]);
  const [saleItemsError, setSaleItemError] = useState(null);
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
    const fetchSaleItems = async () => {
      setLoading(true);

      try {
        const result = await apiService.getData("saleitems", token);
        setSaleItem(result);
        setSaleItemError(null);
        setShowError(false);
      } catch (error) {
        console.error(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleItems();
  }, [refresh, token]);

  const refreshSaleItems = () => setRefresh((prev) => !prev);

  return (
    <SaleItemsContext.Provider
      value={{
        saleItems,
        loading,
        saleItemsError,
        showError,
        setShowError,
        refreshSaleItems,
      }}
    >
      {children}
    </SaleItemsContext.Provider>
  );
};
