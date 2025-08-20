import type { Point } from "../ui/types";
 
 interface CSVUploadProps {
    onPointsParsed: (points: Point[]) => void;
  }
  
  export default function CSVUpload({ onPointsParsed }: CSVUploadProps) {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/);
        const parsedPoints: Point[] = [];
  
        for (const line of lines) {
          if (!line.trim()) continue;
          const parts = line.split(',');
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
  
        onPointsParsed(parsedPoints); // Send points to parent
      };
  
      reader.readAsText(file);
    };
  
    return (
      <div className="p-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4"
        />
      </div>
    );
  }
  