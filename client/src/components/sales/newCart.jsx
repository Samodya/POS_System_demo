import { useState } from "react";
import { ShoppingCart, X, User, Trash2, Trash } from "lucide-react";
import { UseCustomerContext } from "../../context/customerContext";
import { useEffect } from "react";

export const NewCart = () => {
  <button>Cart</button>;
  const [isOpen, setIsOpen] = useState(false);
  const { customers } = UseCustomerContext();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const filteredCustomers =
    searchTerm.length > 0
      ? customers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm)
        )
      : [];

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.retail_price || 0),
    0
  );

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded hover:bg-black hover:text-white transition"
      >
        <ShoppingCart size={20} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Shopping Cart
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto">
              {/* Customer Selection */}
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-700 mb-2">
                  Customer
                </h3>
                <div className="relative">
                  <User
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search for customer by name or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer text-sm"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setSearchTerm(customer.name);
                          }}
                        >
                          <p className="font-semibold">{customer.name}</p>
                          <p className="text-xs text-gray-500">
                            {customer.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedCustomer && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <p>
                      <strong>Selected:</strong> {selectedCustomer.name} (
                      {selectedCustomer.phone})
                    </p>
                  </div>
                )}
              </div>

              {/* Item List */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-gray-700">Items</h3>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash size={16} /> Clear All
                  </button>
                </div>
                <div className="space-y-3">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Model: {item.itemmodel_id}</span>
                            <span className="text-gray-300">|</span>
                            <span>Warranty: {item.warranty_period}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            1 x Rs. {parseFloat(item.retail_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-gray-800">
                            Rs. {parseFloat(item.retail_price || 0).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      Your cart is empty.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 rounded-b-lg border-t mt-auto">
              <div className="flex justify-between items-center text-base font-semibold">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <button className="w-full mt-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
