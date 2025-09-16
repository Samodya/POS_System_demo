import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const RepairContext = createContext();

export const UseRepairContext = () => useContext(RepairContext);

export const RepairContextProvider = ({ children }) => {
  const [repairs, setRepairs] = useState([]);
  const [RepairsError, setRepairsError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    setRepairsError(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchRepairs = async () => {
      setLoading(true);

      try {
        const result = await apiService.getData("repairs", token);
        setRepairs(result);
        setRepairsError(null);
        setShowError(false);
      } catch (error) {
        console.log(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, [refresh]);

  const refreshRepairs = () => setRefresh((prev) => !prev);

  return (
    <RepairContext.Provider
      value={{
        repairs,
        loading,
        RepairsError,
        showError,
        setShowError,
        refreshRepairs,
      }}
    >
      {children}
    </RepairContext.Provider>
  );
};
