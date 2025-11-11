import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (itemToAdd, productDetails, priceType = 'retail') => {
    const isItemInCart = cart.some((cartItem) => cartItem.id === itemToAdd.id);

    if (isItemInCart) {
      return { success: false, message: "Item already in cart." };
    }

    const price = priceType === 'dealer' ? itemToAdd.dealers_price : itemToAdd.retail_price;

    const itemWithProductInfo = {
      ...itemToAdd,
      name: productDetails.productname,
      itemmodel_id: productDetails.itemmodel_id,
      retail_price: price, // Using retail_price key for consistency
      price_type: priceType,
    };

    setCart(prevCart => [...prevCart, itemWithProductInfo]);
    return { success: true, message: "Item added to cart!" };
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};