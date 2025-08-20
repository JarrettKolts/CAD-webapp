export type ContextTargetType = "point" | "line" | "canvas" | "other";

export interface ContextMenuProps {
  targetType: ContextTargetType;
  position: { x: number; y: number };
  data?: any; // Optional data related to the clicked item (like PNEZD for a point)
  onClose: () => void;
};

export interface Point {
  number: string;
  northing: number;
  easting: number;
  elevation: number;
  description: string;
}
