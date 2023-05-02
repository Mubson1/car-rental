import React, { createContext, useState } from "react";

import { ToastItem } from "../components/ToastItem";

import { ToastContainer } from "react-bootstrap";

const contextDefaultValues = {
  showToast: () => null,
  closeToast: () => null,
};

export const ToastNotificationContext = createContext(contextDefaultValues);

export const ToastNotificationContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (notification) => {
    setToasts([notification]);
  };
  const closeToast = () => {
    setToasts([]);
  };

  return (
    <ToastNotificationContext.Provider value={{ showToast, closeToast }}>
      <ToastContainer className="p-3" position="top-end">
        {!!toasts.length &&
          toasts.map((item) => (
            <ToastItem
              {...item}
              onClose={() => {
                closeToast();
              }}
            />
          ))}
      </ToastContainer>
      {children}
    </ToastNotificationContext.Provider>
  );
};
