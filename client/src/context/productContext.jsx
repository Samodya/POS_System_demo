import Cookies from "js-cookie";
import apiService from "../utilities/httpservices";
import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const UseProductContext = () => useContext(ProductContext);

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productError, setProductError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("token");

  const handleError = (error) => {
    const message = error?.message || "Something went wrong";
    setProductError(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await apiService.getData("products", token);
        setProducts(result);
        setProductError(null);
        setShowError(false);
        console.log(result);
      } catch (error) {
        console.error(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refresh, token]);

  // You might want to provide a way to refresh data from children components:
  const refreshProducts = () => setRefresh((prev) => !prev);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        productError,
        showError,
        refreshProducts,
        setShowError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
