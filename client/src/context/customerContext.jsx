import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const CustomerContext = createContext();

export const UseCustomerContext = () => useContext(CustomerContext);

export const CustomerContextProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [customerError, setCustomerError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    setCustomerError(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      
      try {
        const result = await apiService.getData("customers", token);
        setCustomers(result);
        setCustomerError(null);
        setShowError(false);
      } catch (error) {
        console.error(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [refresh]);

  const refreshCustomers = () => setRefresh((prev) => !prev);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        customerError,
        showError,
        setShowError,
        refreshCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
