import { createContext, useState, useContext, useCallback } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [globalerror, setGlobalError] = useState("null");

  // Show an error message
  const showError = useCallback((message) => {
    setGlobalError(message);
    setTimeout(() => setGlobalError(null), 5000); // auto hide after 5s
  }, []);

  // Clear error manually
  const clearError = useCallback(() => setGlobalError(null), []);

  return (
    <ErrorContext.Provider value={{ globalerror, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);

