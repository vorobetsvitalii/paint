import React, { useCallback, useEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import ColorPickerWithRotation from "./components/ColorPickerWithRotation"; // Import the new component
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const colorPickerRef = useRef(null); // Reference for ColorPicker
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(6);
  const [lineColor, setLineColor] = useState("black");
  const [shape, setShape] = useState("pencil");
  const [lines, setLines] = useState([]);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [selectedFigure, setSelectedFigure] = useState(null); // State for selected figure
  const [showColorPicker, setShowColorPicker] = useState(false); // State for showing ColorPicker
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 }); // Position of ColorPicker

  useEffect(() => {
    const storedLines = localStorage.getItem("lines");
    if (storedLines) {
      setLines(JSON.parse(storedLines));
    }
  }, []);

  const redrawLines = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.lineWidth || lineWidth;
      ctx.save();
      if (line.rotation) {
        const centerX = (line.points[0].x + line.points[1].x) / 2;
        const centerY = (line.points[0].y + line.points[1].y) / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((line.rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
      }
      ctx.beginPath();
      if (line.type === "pencil") {
        ctx.moveTo(line.points[0].x, line.points[0].y);
        line.points.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
      } else if (line.type === "line") {
        ctx.moveTo(line.points[0].x, line.points[0].y);
        ctx.lineTo(line.points[1].x, line.points[1].y);
      } else if (line.type === "rectangle") {
        const startX = line.points[0].x;
        const startY = line.points[0].y;
        const endX = line.points[1].x;
        const endY = line.points[1].y;
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
      } else if (line.type === "circle") {
        const startX = line.points[0].x;
        const startY = line.points[0].y;
        const radius = line.radius;
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      }
      ctx.stroke();
      ctx.restore();
    });
  }, [lines, lineWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    redrawLines();
  }, [redrawLines]);

  const startDrawingPencil = (e) => {
    if (e.button !== 0) return;
    setIsDrawing(true);
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;
    setLines((prevLines) => [
      ...prevLines,
      { type: "pencil", points: [{ x: startX, y: startY }], color: lineColor },
    ]);
  };

  const startDrawingLine = (e) => {
    if (e.button !== 0) return;
    setIsDrawing(true);
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;
    setLines((prevLines) => [
      ...prevLines,
      { type: "line", points: [{ x: startX, y: startY }, { x: startX, y: startY }], color: lineColor },
    ]);
  };

  const startDrawingRectangle = (e) => {
    if (e.button !== 0) return;
    setIsDrawing(true);
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;
    setLines((prevLines) => [
      ...prevLines,
      { type: "rectangle", points: [{ x: startX, y: startY }, { x: startX, y: startY }], color: lineColor },
    ]);
  };

  const startDrawingCircle = (e) => {
    if (e.button !== 0) return;
    setIsDrawing(true);
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;
    setStartCoords({ x: startX, y: startY });
    setLines((prevLines) => [
      ...prevLines,
      { type: "circle", points: [{ x: startX, y: startY }], color: lineColor, radius: 0 },
    ]);
  };

  const drawPencil = (e) => {
    if (!isDrawing) return;
    const newX = e.nativeEvent.offsetX;
    const newY = e.nativeEvent.offsetY;
    setLines((prevLines) => {
      const updatedLines = [...prevLines];
      const currentLine = updatedLines[updatedLines.length - 1];
      currentLine.points = [...currentLine.points, { x: newX, y: newY }];
      return updatedLines;
    });
  };

  const drawLine = (e) => {
    if (!isDrawing) return;
    const newX = e.nativeEvent.offsetX;
    const newY = e.nativeEvent.offsetY;
    setLines((prevLines) => {
      const updatedLines = [...prevLines];
      const currentLine = updatedLines[updatedLines.length - 1];
      currentLine.points[1] = { x: newX, y: newY };
      return updatedLines;
    });
  };

  const drawRectangle = (e) => {
    if (!isDrawing) return;
    const newX = e.nativeEvent.offsetX;
    const newY = e.nativeEvent.offsetY;
    setLines((prevLines) => {
      const updatedLines = [...prevLines];
      const currentLine = updatedLines[updatedLines.length - 1];
      currentLine.points[1] = { x: newX, y: newY };
      return updatedLines;
    });
  };

  const drawCircle = (e) => {
    if (!isDrawing) return;
    const startX = startCoords.x;
    const startY = startCoords.y;
    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;
    const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    setLines((prevLines) => {
      const updatedLines = [...prevLines];
      const currentLine = updatedLines[updatedLines.length - 1];
      currentLine.radius = radius;
      return updatedLines;
    });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    localStorage.setItem("lines", JSON.stringify(lines));
  };

  const drawShape = (e) => {
    if (shape === "pencil") drawPencil(e);
    else if (shape === "line") drawLine(e);
    else if (shape === "rectangle") drawRectangle(e);
    else if (shape === "circle") drawCircle(e);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let foundFigure = null;
    let centerX = 0;
    let centerY = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.type === "rectangle") {
        const startX = line.points[0].x;
        const startY = line.points[0].y;
        const endX = line.points[1].x;
        const endY = line.points[1].y;

        if (mouseX >= startX && mouseX <= endX && mouseY >= startY && mouseY <= endY) {
          foundFigure = line;
          centerX = (startX + endX) / 2;
          centerY = (startY + endY) / 2;
          break;
        }
      } else if (line.type === "circle") {
        const startX = line.points[0].x;
        const startY = line.points[0].y;
        const radius = line.radius;
        const distance = Math.sqrt((mouseX - startX) ** 2 + (mouseY - startY) ** 2);

        if (Math.abs(distance - radius) <= 5) {
          foundFigure = line;
          centerX = startX;
          centerY = startY;
          break;
        }
      } else if (line.type === "line" || line.type === "pencil") {
        const points = line.points;
        for (let j = 0; j < points.length - 1; j++) {
          const x1 = points[j].x;
          const y1 = points[j].y;
          const x2 = points[j + 1].x;
          const y2 = points[j + 1].y;

          const distToSegment = (x, y, x1, y1, x2, y2) => {
            const A = x - x1;
            const B = y - y1;
            const C = x2 - x1;
            const D = y2 - y1;

            const dot = A * C + B * D;
            const len_sq = C * C + D * D;
            let param = -1;
            if (len_sq !== 0) param = dot / len_sq;

            let xx, yy;

            if (param < 0) {
              xx = x1;
              yy = y1;
            } else if (param > 1) {
              xx = x2;
              yy = y2;
            } else {
              xx = x1 + param * C;
              yy = y1 + param * D;
            }

            const dx = x - xx;
            const dy = y - yy;
            return Math.sqrt(dx * dx + dy * dy);
          };

          const dist = distToSegment(mouseX, mouseY, x1, y1, x2, y2);

          if (dist <= 5) {
            foundFigure = line;
            centerX = (x1 + x2) / 2;
            centerY = (y1 + y2) / 2;
            break;
          }
        }
      }
    }

    if (foundFigure) {
      setSelectedFigure(foundFigure);
      setColorPickerPosition({ x: centerX, y: centerY });
      setShowColorPicker(true);
    } else {
      setShowColorPicker(false);
      setSelectedFigure(null);
    }
  };

  const handleClickOutside = (e) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
      setShowColorPicker(false);
      setSelectedFigure(null);
    }
  };

  useEffect(() => {
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  const handleChangeColor = (newColor) => {
    if (selectedFigure) {
      selectedFigure.color = newColor;
      setLines((prevLines) => [...prevLines]);
      redrawLines();
      localStorage.setItem("lines", JSON.stringify(lines));
    }
  };

  const handleChangeRotation = (newRotation) => {
    if (selectedFigure) {
      selectedFigure.rotation = newRotation;
      setLines((prevLines) => [...prevLines]);
      redrawLines();
      localStorage.setItem("lines", JSON.stringify(lines));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("contextmenu", handleRightClick);
    return () => {
      canvas.removeEventListener("contextmenu", handleRightClick);
    };
  }, [handleRightClick]);

  return (
    <div className="App">
      <h1>Paint App</h1>
      <div className="draw-area">
        <Menu setLineColor={setLineColor} setShape={setShape} />
        <canvas
          onMouseDown={(e) => {
            if (shape === "pencil") startDrawingPencil(e);
            else if (shape === "line") startDrawingLine(e);
            else if (shape === "rectangle") startDrawingRectangle(e);
            else if (shape === "circle") startDrawingCircle(e);
          }}
          onMouseUp={endDrawing}
          onMouseMove={drawShape}
          ref={canvasRef}
          width={`1280px`}
          height={`720px`}
        />
        {showColorPicker && (
          <div
            ref={colorPickerRef} // Attach ref to the ColorPicker div
            style={{
              position: "absolute",
              left: `${colorPickerPosition.x}px`,
              top: `${colorPickerPosition.y}px`,
              transform: "translate(-50%, -50%)", // Center the ColorPicker
            }}
          >
            <ColorPickerWithRotation
              currentColor={selectedFigure.color}
              onChangeColor={handleChangeColor}
              onChangeRotation={handleChangeRotation} // Handle rotation change
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
