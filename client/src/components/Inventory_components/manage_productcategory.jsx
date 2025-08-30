import Topbar from "../topbar";
import { AddCategry } from "./add_category";

export const ManageProductCategory = () => {
  return (
    <div>
      <Topbar title={"Product Categoies"} />
      <div className="flex py-6 px-10 items-center justify-between">
        <input
          type="text"
          placeholder="Search products by name..."
          className="w-full md:w-64 px-4 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <AddCategry />
      </div>
    </div>
  );
};
