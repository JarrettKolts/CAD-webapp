import React, { useRef, useState, useEffect } from "react";

// interface Point {
//   number: string;
//   northing: number;
//   easting: number;
//   elevation: number;
//   description: string;
// }

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [points, setPoints] = useState<Point[]>([]);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    draw();
  }, [zoom, offset]);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
  
//     console.log("Selected file:", file.name);
  
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const text = event.target?.result as string;
//       console.log("File contents:", text);
  
//       const lines = text.split(/\r?\n/);
//       console.log("This is lines:", lines);
//       const parsedPoints: Point[] = [];
//       console.log("This is Parsed Points", parsedPoints);
  
//       for (const line of lines) {
//         if (!line.trim()) continue; // skip empty lines
//         const parts = line.split(',');
//         if (parts.length !== 5) {
//           console.error("Skipping invalid line:", line);
//           continue;
//         }
  
//         const [p, n, e, z, d] = parts;
//         parsedPoints.push({
//           number: p.trim(),
//           northing: parseFloat(n),
//           easting: parseFloat(e),
//           elevation: parseFloat(z),
//           description: d.trim(),
//         });
//       }
  
//       setPoints(parsedPoints);
//     };
    
//     reader.readAsText(file);
//   };
  
  const draw = () => {
    console.log("This thing is drawing");
    const canvas = canvasRef.current;
    if (!canvas) {
       console.log("No Canvas Detected"); 
    return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("No Canvas Context Detected");
    return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // for (const pt of points) {
    //   const x = pt.easting;
    //   const y = -pt.northing;
    //   ctx.beginPath();
    //   ctx.arc(x, y, 2, 0, 2 * Math.PI);
    //   ctx.fillStyle = "#0077cc";
    //   ctx.fill();
    //   ctx.font = "10px Arial";
    //   ctx.fillText(pt.number, x + 4, y - 4);
    // }

    ctx.restore();
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // prevents page scrolling
  
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, zoom * delta);
  
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const rect = canvas.getBoundingClientRect();
  
    // mouse position relative to canvas top-left corner
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    // world coordinates before zoom
    const worldX = (mouseX - offset.x) / zoom;
    const worldY = (mouseY - offset.y) / zoom;
  
    // update offset so world point stays under the cursor after zoom
    const newOffsetX = mouseX - worldX * newZoom;
    const newOffsetY = mouseY - worldY * newZoom;
  
    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
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
      {/* <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      /> */}
      <canvas
        ref={canvasRef}
        width= {2000}
        height={600}
        className="border border-blue"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}


// import { useState, useRef, useEffect } from "react";
// import { CSVUpload } from "./components/CSVUploader";
// import { DrawingCanvas } from "./components/DrawingCanvas";
// import { Button } from "@/components/ui/button";

// export default function App() {
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Handle toggling fullscreen mode
//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement && containerRef.current) {
//       containerRef.current.requestFullscreen();
//     } else if (document.fullscreenElement) {
//       document.exitFullscreen();
//     }
//   };

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };
//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//     };
//   }, []);

//   return (
//     <div ref={containerRef} className="h-screen w-screen flex flex-col">
//       {!isFullscreen && (
//         <header className="bg-gray-800 text-white p-4 text-xl font-semibold shadow-md">
//           My Whiteboard App
//         </header>
//       )}

//       <main className="flex-1 relative bg-white overflow-hidden">
//         <DrawingCanvas />
//         {!isFullscreen && (
//           <div className="absolute top-4 left-4">
//             <CSVUploader />
//           </div>
//         )}
//         <Button
//           onClick={toggleFullscreen}
//           className="absolute top-4 right-4 z-10"
//         >
//           {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
//         </Button>
//       </main>

//       {!isFullscreen && (
//         <footer className="bg-gray-200 text-center p-3 text-sm text-gray-600 shadow-inner">
//           &copy; 2025 My Cool App. All rights reserved.
//         </footer>
//       )}
//     </div>
//   );
// }