import React from "react";
import { useError } from "./ErrorContext";

export default function GlobalError() {
  const { error, clearError } = useError('Test Error');

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
      <span>{error}</span>
      <button
        onClick={clearError}
        className="text-white font-bold hover:text-gray-200"
      >
        ✖
      </button>
    </div>
  );
}
