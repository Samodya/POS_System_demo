import React, { createContext, useCallback, useContext, useState, useRef, useEffect } from "react";

const ErrorContext = createContext();

/**
 * ErrorProvider - provides showError / clearError to children.
 * Auto-hides after `autoHideMs` (default 5000). Hovering will pause auto-hide.
 */
export const ErrorProvider = ({ children, autoHideMs = 5000 }) => {
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showError = useCallback((message, options = {}) => {
    // options: { title, autoHideMs }
    const payload = { message: String(message || "Something went wrong"), title: options.title || "Error" };
    setError(payload);

    const ms = typeof options.autoHideMs === "number" ? options.autoHideMs : autoHideMs;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (ms > 0) {
      timerRef.current = setTimeout(() => {
        if (!pausedRef.current) clearError();
      }, ms);
    }
  }, [autoHideMs, clearError]);

  // Pause timer on hover
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const pause = () => { pausedRef.current = true; };
  const resume = () => {
    pausedRef.current = false;
    // restart timer to close after remaining duration - for simplicity restart full timer:
    if (error) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => clearError(), autoHideMs);
    }
  };

  return (
    <ErrorContext.Provider value={{ error, showError, clearError, pauseErrorAutoHide: pause, resumeErrorAutoHide: resume }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) {
    // Return safe no-op functions so using contexts outside provider doesn't crash
    return {
      error: null,
      showError: () => {},
      clearError: () => {},
      pauseErrorAutoHide: () => {},
      resumeErrorAutoHide: () => {},
    };
  }
  return ctx;
};
