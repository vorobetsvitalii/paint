import React, { useState } from 'react';

// Компонент для квадрата
const Square = ({ x, y, size, color, onDrag, onResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      onDrag(dx, dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
    if (isResizing) {
      const dx = e.clientX - resizeStart.x;
      const dy = e.clientY - resizeStart.y;
      onResize(dx, dy);
      setResizeStart({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <rect
      x={x}
      y={y}
      width={size}
      height={size}
      fill={color}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
};

export {Square}