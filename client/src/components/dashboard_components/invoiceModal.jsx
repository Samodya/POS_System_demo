import { useState, useRef, useEffect } from "react";
import { UseProductContext } from "../../context/productContext";
import Topbar from "../topbar";
import logo from "../../assets/logo.png";
import { useReactToPrint } from "react-to-print";

export const Invoice = () => {
  const [invoiceItems, setInvoiceItem] = useState("products");
  const { products } = UseProductContext();
  const [itemArray, setItemArray] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const handleAdd = (product) => {
    const useDealerPrice = dealerPriceStates[product.id] || false;
    const unitPrice = useDealerPrice ? product.dealers_price : product.price;

    setItemArray((prev) => {
      // Find if product already exists
      const existingItem = prev.find((item) => item.id === product.id);

      const currentCount = existingItem ? existingItem.count : 0;
      if (product.quantity === 0 || currentCount >= product.quantity) {
        return prev; // don't add more
      }

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

  const handleRemove = (product) => {
    setItemArray((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (!existingItem) return prev;

      if (existingItem.count === 1) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                count: item.count - 1,
                totalPrice: (item.count - 1) * item.unitPrice,
              }
            : item
        );
      }
    });
  };

  useEffect(() => {
    console.log(itemArray);
    console.log(totalSum);
  }, [itemArray]);

  const totalSum = itemArray.reduce(
    (acc, item) => acc + Number(item.totalPrice),
    0
  );

  const displayBill = () => {
    return (
      <div className="w-full">
        <div>
          Invoice : 001
          <div className="flex justify-between my-2">
            <div className="text-xs">
              <span className="font-medium">Customer Name: </span>
              {customerName}
            </div>
            <div className="text-xs">
              <span className="font-medium">phone: </span>
              {phone}
            </div>
          </div>
        </div>

        {itemArray.map((item) => (
          <div
            key={item.id}
            className="flex flex-col font-thin text-xs justify-between w-full mb-1"
          >
            <div className="flex font-bold text-xs justify-between mb-0.5">
              {item.name}
            </div>
            <div className="flex items center justify-between w-full text-sm">
              <div>
                <span className="font-bold">Price :</span>
                {item.unitPrice}
              </div>
              <div>
                <span>Units:</span>
                {item.count}
              </div>
              <div>{item.totalPrice}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
        <div className="flex-2 bg-white  rounded-2xl shadow-lg overflow-auto h-180 ">
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h2 className="text-sm font-semibold mb-3 text-gray-700">
              Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="border text-xs border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="border text-xs border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="border text-xs border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                  className="border text-xs border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 items-center justify-center border-b bg-gray-100">
            <div
              className={`flex-1 py-1 text-center text-sm font-medium cursor-pointer transition ${
                invoiceItems === "products"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setInvoiceItem("products")}
            >
              Accessories
            </div>
            <div
              className={`flex-1 py-1 text-center text-sm font-medium cursor-pointer transition ${
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
                    className="px-4 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-2xl rounded"
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
                        className={`text-xs h-5 w-20 rounded-lg text-white ${
                          product.quantity === 0 ||
                          (itemArray.find((i) => i.id === product.id)?.count ||
                            0) >= product.quantity
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        onClick={() => handleAdd(product)}
                        disabled={
                          product.quantity === 0 ||
                          (itemArray.find((i) => i.id === product.id)?.count ||
                            0) >= product.quantity
                        }
                      >
                        Add
                      </button>
                      <button
                        className="text-xs h-5 w-20 rounded-lg bg-red-500 text-white hover:bg-red-600 "
                        onClick={() => handleRemove(product)}
                      >
                        Remove
                      </button>
                    </div>
                    {(product.quantity === 0 ||
                      (itemArray.find((i) => i.id === product.id)?.count ||
                        0) >= product.quantity) && (
                      <div className="flex justify-center bg-red-500 text-xs font-semibold p-0.5 text-white mt-0.5">
                        out of stock
                      </div>
                    )}
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
            {/* Item List */}
            {displayBill()}

            {/* Total */}
            <div className="flex justify-between text-sm font-medium mt-2">
              <span>Total:</span>
              <span>Rs. {totalSum}.00</span>
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
