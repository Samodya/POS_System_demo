import { BoxIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { EditItem } from "./edit_item";

export const InventoryListItem = ({
  id,
  filePath,
  name,
  category,
  buyingPrice,
  price,
  dealers_price,
  quantity,
}) => {
  const [formattedFilepath, setFormattedfilePath] = useState("");

  useEffect(() => {
    if (filePath) {
      const forfilePath = filePath.replace(/^\/+/, "");
      setFormattedfilePath(forfilePath);
    }
  }, [filePath]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center max-w-xs mx-auto hover:shadow-lg transition-shadow duration-300 h-[60vh] overflow-auto ">
      <div className="mb-3 w-40 h-40 sm:w-20 sm:h-20 md:w-50 md:h-50 lg:w-60 lg:h-60 rounded-lg overflow-hidden border border-indigo-500 shadow-sm">
        {filePath ? (
          <img
            src={`http://localhost:4000/${formattedFilepath}`}
            alt={name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-indigo-500">
            <BoxIcon size={48} />
            <p className="mt-2 text-sm font-semibold">No Image</p>
          </div>
        )}
      </div>
      <h3 className="font-semibold text-sm truncate mb-1">{name}</h3>
      <p className="text-gray-600 text-sm mb-1">
        {category || "Uncategorized"}
      </p>
      <div className="space-y-1 text-gray-700 text-sm mb-3">
        <p>Buying Price: Rs.{buyingPrice ?? "-"}</p>
        <p>Dealer's Price: Rs.{dealers_price ?? "-"}</p>
        <p>Selling Price: Rs.{price ?? "-"}</p>
        <p>Quantity: {quantity ?? "-"}</p>
      </div>
      <div className="flex w-full justify-between gap-2">
        <button
          className="flex items-center justify-center gap-1 text-white bg-red-600 hover:bg-red-700 rounded-md px-3 py-1 text-sm font-semibold transition"
          aria-label="Delete item"
        >
          <Trash2 size={16} />
          Delete
        </button>
        <EditItem id={id} />
      </div>
    </div>
  );
};
