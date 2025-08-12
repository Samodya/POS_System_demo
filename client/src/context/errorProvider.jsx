import { createContext, useState, useContext, useCallback } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  // Show an error message
  const showError = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // auto hide after 5s
  }, []);

  // Clear error manually
  const clearError = useCallback(() => setError(null), []);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);

