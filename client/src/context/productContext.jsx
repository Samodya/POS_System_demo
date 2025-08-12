const { createContext, useContext, useState } = require("react");

const ProductContext = createContext();

export const UseProductContext = () => useContext(ProductContext);

export const ProductContexProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productError, setProductsError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    if (message !== tasksError) {
      setProductsError(message);
      setShowError(true);
    }
  };

  return (
    <ProductContext.Provider value={{}}>{children}</ProductContext.Provider>
  );
};
