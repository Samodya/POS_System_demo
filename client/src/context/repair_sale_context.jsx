import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const RepairSaleContext = createContext();

export const UseRepairSaleContext = () => useContext(RepairSaleContext);

export const RepairSaleContextProvider = ({ children }) => {
  const [repairsales, setRepairSales] = useState([]);
  const [repairsalesError, setRepairsalesError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    setRepairsalesError(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchRepairSales = async () => {
      setLoading(true);
      
      try {
        const result = await apiService.getData("repair-sales", token);
        setRepairSales(result);
        setRepairsalesError(null);
        setShowError(false);
      } catch (error) {
        console.error(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairSales();
  }, [refresh]);

  const calculateOverallRepairs = () => {
    const count = repairsales.length;
    const totalAmount = repairsales.reduce((sum, sale) => {
        const amount = parseFloat(sale.total_amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return { count, totalAmount };
};

  const refreshRepairSales = () => setRefresh((prev) => !prev);

  return (
    <RepairSaleContext.Provider
      value={{
        repairsales,
        loading,
        repairsalesError,
        showError,
        calculateOverallRepairs,
        setShowError,
        refreshRepairSales,
      }}
    >
      {children}
    </RepairSaleContext.Provider>
  );
};
