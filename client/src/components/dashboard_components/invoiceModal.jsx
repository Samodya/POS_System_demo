import { useState, useRef, useEffect } from "react";
import { UseProductContext } from "../../context/productContext";
import Topbar from "../topbar";
import logo from "../../assets/logo.png";
import { useReactToPrint } from "react-to-print";

export const Invoice = () => {
  const [invoiceItems, setInvoiceItem] = useState("products");
  const { products } = UseProductContext();
  const [addItem, setAddItem] = useState(0);
  const [itemArray, setItemArray] = useState([]);

  const handleAdd = (product) => {
    const useDealerPrice = dealerPriceStates[product.id] || false;
    const unitPrice = useDealerPrice ? product.dealers_price : product.price;
  
    setItemArray((prev) => {
      // Find if product already exists
      const existingItem = prev.find((item) => item.id === product.id);
  
      if (existingItem) {
        // Only update this item
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                unitPrice, // update unitPrice if user changed toggle
                count: item.count + 1,
                totalPrice: (item.count + 1) * unitPrice,
              }
            : item
        );
      } else {
        // Add new product
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            unitPrice,
            count: 1,
            totalPrice: unitPrice,
          },
        ];
      }
    });
  };
  

  useEffect(() => {
    console.log(itemArray);
  }, [itemArray]);

  // Keep track of dealer price toggles for each product
  const [dealerPriceStates, setDealerPriceStates] = useState({});

  const toggleDealerPrice = (id, value) => {
    setDealerPriceStates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Topbar title={"Invoice"} />
      <div className="flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex-2 bg-white  rounded-2xl shadow-lg overflow-hidden h-180 ">
          {/* Tabs */}
          <div className="flex gap-2 items-center justify-center border-b bg-gray-100">
            <div
              className={`flex-1 py-3 text-center text-sm font-medium cursor-pointer transition ${
                invoiceItems === "products"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setInvoiceItem("products")}
            >
              Accessories
            </div>
            <div
              className={`flex-1 py-3 text-center text-sm font-medium cursor-pointer transition ${
                invoiceItems === "Repairs"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setInvoiceItem("Repairs")}
            >
              Repairs
            </div>
          </div>

          {/* Product List */}
          {invoiceItems == "products" ? (
            <div className="p-4 space-y-2">
              {products.map((product) => {
                const useDealerPrice = dealerPriceStates[product.id] || false;

                return (
                  <div
                    key={product.id}
                    className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-2xl rounded"
                  >
                    {/* Product Info */}
                    <div className="text-sm font-medium max-w-[200px] break-words">
                      {product.name}
                    </div>

                    {/* Price Selector */}
                    <div className="flex items-center justify-center gap-2">
                      <div
                        onClick={() => toggleDealerPrice(product.id, false)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                          !useDealerPrice
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-600 border-gray-300"
                        }`}
                      >
                        Rs. {product.price}
                      </div>
                      <div
                        onClick={() => toggleDealerPrice(product.id, true)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                          useDealerPrice
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-gray-600 border-gray-300"
                        }`}
                      >
                        Dealer: Rs. {product.dealers_price}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center grid-cols-2 gap-2 mt-2 sm:mt-0 justify-center">
                      <button
                        className="text-xs h-5 w-20 rounded-lg bg-blue-500 text-white hover:bg-blue-600 "
                        onClick={() => handleAdd(product)}
                      >
                        Add
                      </button>
                      <button className="text-xs h-5 w-20 rounded-lg bg-red-500 text-white hover:bg-red-600 ">
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Right Section */}
        <div className="flex-1 rounded-2xl bg-white shadow-lg p-4 flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-16 rounded-full shadow"
            />
            <div>
              <div className="text-xl font-bold">
                <span className="text-blue-600">Master</span>
                <span className="text-blue-400">Tech</span>
              </div>
              <div className="text-xs font-semibold text-gray-400">
                Computer Solutions
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="w-full border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Items:</span>
              <span>{addItem}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <span>Rs. 0</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button className="mt-auto w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
