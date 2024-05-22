import React, { useState } from 'react';

const Circle = ({ cx, cy, radius, color, onDrag, onResize }) => {
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
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    );
  };
  
  export {Circle}