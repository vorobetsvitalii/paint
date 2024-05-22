// ColorPicker.js
import React from "react";

const ColorPicker = ({ currentColor, onChange }) => {
  return (
    <input
      type="color"
      value={currentColor}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ColorPicker;
