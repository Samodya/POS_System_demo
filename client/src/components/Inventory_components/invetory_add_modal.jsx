import { BoxIcon, X } from "lucide-react";
import { useState } from "react";

export const AddProduct = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <button
        className="bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] text-white flex p-2 
        rounded cursor-pointer items-center justify-center gap-2 hover:brightness-110 transition"
        onClick={() => setShowMenu(true)}
      >
        <BoxIcon size={20} /> Add Product
      </button>

      {showMenu && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-white-900 bg-opacity-10 backdrop-blur-sm"
            style={{ zIndex: 1000 }}
            onClick={() => setShowMenu(false)}
          ></div>
          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 1001 }}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Item</h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Content */}
              <form className="space-y-6">
                {/* Image upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-xl border border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src=""
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-600
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gradient-to-r file:from-black file:via-[#0a0f2c] file:to-[#013ea0]
                      file:text-white
                      hover:file:brightness-110
                      cursor-pointer
                    "
                  />
                </div>

                {/* Form inputs grid */}
                <div className="grid grid-cols-2 gap-6 ">
                  <InputGroup
                    label="Product Name"
                    type="text"
                    placeholder="Enter product name"
                  />
                  <InputGroup
                    label="Category"
                    type="select"
                    options={["", "Laptop", "Accessory", "Repair Service"]}
                  />
                  <InputGroup
                    label="Buying Price"
                    type="number"
                    placeholder="Enter buying price"
                  />
                  <InputGroup
                    label="Selling Price"
                    type="number"
                    placeholder="Enter selling price"
                  />
                  <InputGroup
                    label="Dealer Price"
                    type="number"
                    placeholder="Enter dealer price"
                  />
                  <InputGroup
                    label="Quantity"
                    type="number"
                    placeholder="Enter quantity"
                  />
                </div>
                <TextareaGroup
                  label="Description"
                  placeholder="Add a description..."
                />
                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#0a0f2c] via-[#013ea0] to-black text-white rounded-xl text-lg font-semibold hover:brightness-110 transition"
                >
                  Save Product
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function InputGroup({ label, type, placeholder, options = [] }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-medium text-gray-700">{label}</label>
      {type === "select" ? (
        <select className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#013ea0]">
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt || "Select..."}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
        />
      )}
    </div>
  );
}

function TextareaGroup({ label, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-medium text-gray-700">{label}</label>
      <textarea
        placeholder={placeholder}
        rows={4}
        className="border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
      />
    </div>
  );
}
