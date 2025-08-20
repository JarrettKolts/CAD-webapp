// // ContextMenu.tsx
// export function ContextMenu({ x, y, options, onClose }) {
//     return (
//       <div
//         className="absolute bg-white border shadow p-2"
//         style={{ left: x, top: y }}
//         onContextMenu={(e) => e.preventDefault()}
//         onClick={onClose}
//       >
//         {options.map((opt, i) => (
//           <div
//             key={i}
//             className="hover:bg-gray-200 cursor-pointer p-1"
//             onClick={() => {
//               opt.onClick()
//               onClose()
//             }}
//           >
//             {opt.label}
//           </div>
//         ))}
//       </div>
//     )
//   }
  

import React from "react";
import type { ContextMenuProps } from "./types";

const ContextMenu: React.FC<ContextMenuProps> = ({ targetType, position, data, onClose }) => {
  const renderOptions = () => {
    switch (targetType) {
      case "point":
        return (
          <>
            <div onClick={() => console.log("Edit Point", data)}>Edit Point</div>
            <div onClick={() => console.log("Delete Point", data)}>Delete Point</div>
          </>
        );
      case "line":
        return (
          <>
            <div onClick={() => console.log("Edit Line", data)}>Edit Line</div>
            <div onClick={() => console.log("Delete Line", data)}>Delete Line</div>
          </>
        );
      default:
        return <div>No options available</div>;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundColor: "white",
        border: "1px solid black",
        padding: "8px",
        zIndex: 1000,
      }}
      onMouseLeave={onClose}
    >
      {renderOptions()}
    </div>
  );
};

export default ContextMenu;