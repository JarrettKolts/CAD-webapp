import React, { useRef, useState, useEffect } from "react";

interface Point {
  number: string;
  northing: number;
  easting: number;
  elevation: number;
  description: string;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    draw();
  }, [points, zoom, offset]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split("\n");
      const parsedPoints = rows
        .map((row) => row.trim())
        .filter((row) => row.length > 0)
        .map((row) => {
          const [number, n, e, z, d] = row.split(",");
          return {
            number,
            northing: parseFloat(n),
            easting: parseFloat(e),
            elevation: parseFloat(z),
            description: d || "",
          };
        });
      setPoints(parsedPoints);
    };
    reader.readAsText(file);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    for (const pt of points) {
      const x = pt.easting;
      const y = -pt.northing;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "#0077cc";
      ctx.fill();
      ctx.font = "10px Arial";
      ctx.fillText(pt.number, x + 4, y - 4);
    }

    ctx.restore();
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.max(0.1, z * delta));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Civil3D Web: PNEZD Viewer</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-gray-400"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
