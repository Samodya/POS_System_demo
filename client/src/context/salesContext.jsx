import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const SaleContext = createContext();

export const UseSaleContext = () => useContext(SaleContext);

export const SaleContextProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [salesError, setSalesError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    setSalesError(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);

      try {
        const result = await apiService.getData("sales", token);
        setSales(result);
        setSalesError(null);
        setShowError(false);
      } catch (error) {
        console.error(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [refresh]);

  const calculateOverall = () => {
    const count = sales.length;
    const totalAmount = sales.reduce((sum, sale) => {
      const amount = parseFloat(sale.total_amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return { count, totalAmount };
  };

  const refreshSales = () => setRefresh((prev) => !prev);

  return (
    <SaleContext.Provider
      value={{
        sales,
        loading,
        salesError,
        showError,
        calculateOverall,
        setShowError,
        refreshSales,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};
