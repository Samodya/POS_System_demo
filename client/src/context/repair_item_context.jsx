import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const RepairItemContext = createContext();

export const UseRepairItemContext = () => useContext(RepairItemContext);

export const RepairItemContextProvider = ({ children }) => {
  const [repairSales, setRepairSales] = useState([]);
  const [repairSalesError, setRepairSalesError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    setRepairSalesError(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      
      try {
        const result = await apiService.getData("repair-items", token);
        setRepairSales(result);
        setRepairSalesError(null);
        setShowError(false);
      } catch (error) {
        console.error(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [refresh, token]);

  const refreshCustomers = () => setRefresh((prev) => !prev);

  return (
    <RepairItemContext.Provider
      value={{
        repairSales,
        loading,
        repairSalesError,
        showError,
        setShowError,
        refreshCustomers,
      }}
    >
      {children}
    </RepairItemContext.Provider>
  );
};
