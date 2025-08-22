import { handleFileUpload } from "../utils/handleFileUpload";
import type { Point } from "../ui/types";

interface CSVUploadProps {
  onPointsParsed: (points: Point[]) => void;
}

export default function CSVUpload({ onPointsParsed }: CSVUploadProps) {
  const onUploadClick = async () => {
    const file = await handleFileUpload({ accept: ".csv" });
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/);
      const parsedPoints: Point[] = [];

      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(",");
        if (parts.length !== 5) {
          console.error("Skipping invalid line:", line);
          continue;
        }

        const [p, n, e, z, d] = parts;
        parsedPoints.push({
          number: p.trim(),
          northing: parseFloat(n),
          easting: parseFloat(e),
          elevation: parseFloat(z),
          description: d.trim(),
        });
      }

      onPointsParsed(parsedPoints);
    };

    reader.readAsText(file as File); // type-safe since multiple = false
  };

  return (
    <div className="p-4">
      <button
        onClick={onUploadClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload CSV
      </button>
    </div>
  );
}
