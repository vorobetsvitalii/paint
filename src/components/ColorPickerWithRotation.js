import React, { useState } from "react";

const ColorPickerWithRotation = ({ currentColor, onChangeColor, onChangeRotation }) => {
  const [rotation, setRotation] = useState(0);

  const handleColorChange = (e) => {
    onChangeColor(e.target.value);
  };

  const handleRotationChange = (e) => {
    const newRotation = parseFloat(e.target.value);
    setRotation(newRotation);
    onChangeRotation(newRotation);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        type="color"
        value={currentColor}
        onChange={handleColorChange}
      />
      <input
        type="number"
        value={rotation}
        onChange={handleRotationChange}
        placeholder="Rotation (degrees)"
      />
    </div>
  );
};

export default ColorPickerWithRotation;
