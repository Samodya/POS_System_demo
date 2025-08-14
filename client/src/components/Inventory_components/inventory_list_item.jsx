import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {EditItem} from "./edit_item"; // adjust path

export const InventoryListItem = ({
  id,
  filePath,
  name,
  category,
  buyingPrice,
  price,
  dealers_price,
  quantity,
  description,
  onDelete,
}) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (filePath) {
      const formattedPath = filePath.replace(/^\/+|\\/g, "/");
      setImageSrc(`http://localhost:4000/${formattedPath}`);
    }
  }, [filePath]);

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition w-full max-w-sm">
      {/* Image */}
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
      {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-3">
        {/* Product Name */}
        <h2 className="text-lg font-semibold text-gray-800 leading-snug break-words">
          {name}
        </h2>

        {/* Category */}
        <p className="text-sm text-gray-500 mb-1">{category}</p>

        {/* Prices */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-sm text-gray-700">
        <div><span className="font-semibold">Buying Price:</span> {buyingPrice}  </div>
          <div><span className="font-semibold">Selling Price:</span> {price}  </div>
          <div><span className="font-semibold">Dealer's Rrice:</span> {dealers_price}</div>
        </div>

        {/* Quantity */}
        <p className= {quantity<3 ? "font-semibold text-red-500 text-sm mb-2":"font-semibold text-sm mb-2"} >
          <span className= {quantity<3 ? "font-semibold text-red-500":"font-semibold"}>Qty:</span> {quantity}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 break-words">{description}</p>

        {/* Action Buttons */}
        <div className="mt-auto flex w-full justify-between gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1 text-white bg-red-600 hover:bg-red-700 rounded-md px-3 py-1 text-sm font-semibold transition"
            aria-label="Delete item"
          >
            <Trash2 size={16} />
            Delete
          </button>
          <EditItem id={id} />
        </div>
      </div>
    </div>
  );
};
