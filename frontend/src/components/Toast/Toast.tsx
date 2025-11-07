import React from "react";
import "./Toast.scss";

interface ToastProps {
  message: string;
  type?: "success" | "error";
}

const Toast: React.FC<ToastProps> = ({ message, type = "success" }) => {
  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
