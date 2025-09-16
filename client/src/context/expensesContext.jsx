import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../utilities/httpservices";
import Cookies from "js-cookie";

const ExpensesContext = createContext();

export const UseExpensesContext = () => useContext(ExpensesContext);

export const ExpensesContextProvider = ({ children }) => {
  const [sales_logs, setSales_logs] = useState([]);
  const [expensesError, setExpensesError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);

      try {
        const result = await apiService.getData("stock-log", token);
        setSales_logs(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenses();
  }, [refresh]);

  const calculateOverallExpenses = () => {
    const count = sales_logs.length;
    const totalAmount = sales_logs.reduce((sum, log) => {
      const amount = parseFloat(log.total_amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return { count, totalAmount };
  };

  const refreshExpenses = () => setRefresh((prev) => !prev);

  return (
    <ExpensesContext.Provider
      value={{ sales_logs, refreshExpenses, calculateOverallExpenses }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};
