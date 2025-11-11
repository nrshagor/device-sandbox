import React from "react";
import "./HintBox.scss";

interface HintBoxProps {
  message: string;
}

const HintBox: React.FC<HintBoxProps> = ({ message }) => {
  return (
    <div className="hint-box">
      <div className="hint-pointer" />
      <p>{message}</p>
    </div>
  );
};

export default HintBox;
