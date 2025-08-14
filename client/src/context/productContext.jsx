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

  const getLowStockProducts = () => {
    return products.filter((product) => product.quantity < 3);
  };

  // Get products created this week
  const getThisWeekProducts = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); 
    startOfWeek.setHours(0, 0, 0, 0);

    return products.filter((product) => {
      if (!product.created_at) return false;
      const createdDate = new Date(product.created_at);
      return createdDate >= startOfWeek && createdDate <= now;
    });
  };


  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        productError,
        showError,
        refreshProducts,
        setShowError,
        getLowStockProducts,
        getThisWeekProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
