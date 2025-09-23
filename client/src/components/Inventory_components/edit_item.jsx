import Cookies from "js-cookie";
import { BoxIcon, Boxes, X } from "lucide-react";
import { useState, useEffect } from "react";
import { UseProductContext } from "../../context/productContext";
import apiService from "../../utilities/httpservices";

export const EditItem = ({ id }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [preview, setPreview] = useState(null);
  const [itemimage, setItemimage] = useState("");
  const [files, setFiles] = useState(null);
  const token = Cookies.get("token");
  const { refreshProducts } = UseProductContext();
  const [modelSearch, setModelSearch] = useState("");
  const [showModelList, setShowModelList] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    itemmodel_id: "",
    buyingPrice: "",
    sellingPrice: "",
    dealerPrice: "",
    quantity: "",
    description: "",
    warranty: "",
    conditions: "",
    serial_no:""
  });

  async function fetchItem() {
    try {
      // Assuming apiService.getDataById works as expected
      const result = await apiService.getDataById("products", id, token);
      setFormData({
        productName: result.name || "",
        category: result.category || "",
        itemmodel_id: result.itemmodel_id || "",
        buyingPrice: result.buying_price || "",
        sellingPrice: result.price || "",
        dealerPrice: result.dealers_price || "",
        quantity: result.quantity || "",
        description: result.description || "",
        warranty: result.warranty || "",
        conditions: result.conditions || "",
        serial_no: result.serial_no || "",
      });
      setItemimage(result.image_path);
    } catch (error) {
      console.error("Failed to fetch item:", error);
    }
  }

  useEffect(() => {
    if (showMenu) {
      fetchItem();
    }

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [showMenu]); // Re-run when showMenu changes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous URL if one exists before setting new one
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
      setFiles(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // If you plan to implement search, you'd handle modelSearch here too
    // For now, it updates formData.itemmodel_id
    if (name === 'itemmodel_id') {
      setModelSearch(value); // Keep modelSearch in sync with input for search-like feel
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.productName);
    form.append("category", formData.category);
    form.append("itemmodel_id", formData.itemmodel_id);
    form.append("buying_price", formData.buyingPrice);
    form.append("price", formData.sellingPrice);
    form.append("dealers_price", formData.dealerPrice);
    form.append("quantity", formData.quantity);
    form.append("description", formData.description);
    form.append("warranty", formData.warranty);
    form.append("conditions", formData.conditions);
    form.append("serial_no",formData.serial_no)

    // Only append image if a new file was selected
    if (files) {
      form.append("image", files);
    }

    try {
      // Assuming apiService.updateData works as expected
      const result = await apiService.updateData("products", id, form, token);
      refreshProducts();
      setShowMenu(false);
    } catch (err) {
      console.error("Update failed", err);
      // Optional: Add user feedback for failure
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        className="flex items-center justify-center gap-1 text-white bg-gradient-to-r from-black via-[#0a0f2c] to-[#013ea0] px-2 py-1 rounded"
        onClick={() => {
          // fetchItem is called inside useEffect when showMenu is true
          setShowMenu(true);
        }}
      >
        <Boxes size={20} /> <p>Edit</p>
      </button>

      {showMenu && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black-900 bg-opacity-30 backdrop-blur-sm"
            style={{ zIndex: 1000 }}
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center p-3"
            style={{ zIndex: 1001 }}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-4 relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Item Details
                </h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Form */}
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {/* Image upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-28 h-28 rounded-xl border text-gray-600 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : itemimage ? (
                      <img
                        src={`http://localhost:4000/${itemimage.replace(
                          /^\/+/,
                          ""
                        )}`}
                        alt="Current Item"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <BoxIcon size={60} />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gradient-to-r file:from-black file:via-[#0a0f2c] file:to-[#013ea0]
                      file:text-white hover:file:brightness-110 cursor-pointer"
                  />
                </div>

                {/* Form inputs grid */}
                <div className="grid grid-cols-2 gap-6 ">
                  <div className="flex flex-col relative">
                    <label className="mb-1 font-medium text-gray-700">
                      Model Code
                    </label>
                    <input
                      name="itemmodel_id"
                      type="text"
                      value={formData.itemmodel_id}
                      onChange={handleChange}
                      placeholder="enter model..."
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
                    />
                  </div>
                  <div className="flex flex-col relative">
                    <label className="mb-1 font-medium text-gray-700">
                      Serial Number
                    </label>
                    <input
                      name="serial_no"
                      type="text"
                      value={formData.serial_no}
                      onChange={handleChange}
                      placeholder="enter serial number..."
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 ">
                  <InputGroup
                    name="productName"
                    label="Product Name"
                    value={formData.productName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter product name"
                  />
                  <InputGroup
                    name="category"
                    label="Category"
                    value={formData.category}
                    onChange={handleChange}
                    type="select"
                    options={["", "Laptop", "Accessory", "Repair Service"]}
                  />
                  <InputGroup
                    name="warranty"
                    label="Warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    type="select"
                    options={["", "3-months", "6-months", "1-year", "2-years"]}
                  />

                  <InputGroup
                    name="conditions"
                    label="Condition"
                    value={formData.conditions}
                    onChange={handleChange}
                    type="select"
                    options={["", "Brand-new", "Second-hand"]}
                  />
                  <InputGroup
                    name="buyingPrice"
                    label="Buying Price"
                    value={formData.buyingPrice}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter buying price"
                  />
                  <InputGroup
                    name="sellingPrice"
                    label="Selling Price"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter selling price"
                  />
                  <InputGroup
                    name="dealerPrice"
                    label="Dealer Price"
                    value={formData.dealerPrice}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter dealer price"
                  />
                  <InputGroup
                    name="quantity"
                    label="Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    disabled={true}
                    type="number"
                    placeholder="Enter quantity"
                  />
                </div>

                <TextareaGroup
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a description..."
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#0a0f2c] via-[#013ea0] to-black text-white rounded-xl text-xm font-semibold hover:brightness-110 transition"
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

// FIX: Correctly apply the disabled boolean attribute
function InputGroup({
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  disabled, // This will be a boolean if passed, or undefined
  options = [],
}) {
  const isDisabled = disabled === true || disabled === 'true'; // Check for boolean true or string 'true'

  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          className="border border-gray-300 rounded-md p-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
          value={value}
          onChange={onChange}
          disabled={isDisabled} // Apply boolean attribute
        >
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt || "Select..."}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled} // Apply boolean attribute
          className="border border-gray-300 rounded-md p-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
        />
      )}
    </div>
  );
}

function TextareaGroup({ name, label, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="border border-gray-300 rounded-md text-sm p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#013ea0]"
      />
    </div>
  );
}