import { useEffect, useState } from "react";
import { EditItem } from "./edit_item"; // adjust path
import { DeleteItem } from "./delete_items";

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
  itemModel,
}) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (filePath) {
      const formattedPath = filePath.replace(/^\/+|\\/g, "/");
      setImageSrc(`http://localhost:4000/${formattedPath}`);
    }
  }, [filePath]);

  return (
    <div className="rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 flex">
      {/* Image */}
      <div className="w-36 h-auto bg-gray-100 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-y-1 gap-x-6 text-sm">
        <div className="col-span-2">
          <h2 className="text-base font-semibold text-gray-800">{name}</h2>
          <p className="text-gray-500">{category} • {itemModel}</p>
        </div>

        <p className="font-medium text-gray-800">
          Price: <span className="text-green-600">Rs.{price}</span>
        </p>
        <p className="text-gray-700">
          Dealer: <span className="text-blue-600">Rs.{dealers_price}</span>
        </p>

        <p className="text-gray-700">
          Qty:{" "}
          <span
            className={`${
              quantity > 5 ? "text-green-600" : "text-red-600"
            } font-medium`}
          >
            {quantity}
          </span>
        </p>
        {description && (
          <p className="col-span-2 text-gray-600 text-xs mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center gap-2 p-3 border-l border-gray-200">
        <EditItem id={id} />
        <DeleteItem id={id} />
      </div>
    </div>
  );
};
