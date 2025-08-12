import React from "react";
import { useError } from "../context/ErrorContext";

export default function GlobalErrorModal() {
  const { error, clearError, pauseErrorAutoHide, resumeErrorAutoHide } = useError();

  if (!error) return null;

  return (
    // backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-live="assertive"
      onMouseEnter={pauseErrorAutoHide}
      onMouseLeave={resumeErrorAutoHide}
    >
      {/* Blur + dim background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={clearError} />

      {/* Modal */}
      <div
        className="relative z-10 max-w-lg w-[90%] md:w-1/2 bg-white rounded-2xl shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={error.title || "Error"}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {/* error icon */}
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">{error.title || "Error"}</h3>
                <button
                  onClick={clearError}
                  className="text-gray-400 hover:text-gray-600 rounded-md p-1"
                  aria-label="Close error"
                >
                  ✕
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-700 break-words">{error.message}</p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearError}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
