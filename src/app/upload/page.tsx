"use client";

import { useState } from "react";
import Papa from "papaparse";
import { getSequenceStats } from "../../utils/sequenceStats";
import LengthHistogram from './../../components/LengthHistogram';

export default function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const stats = getSequenceStats(parsedData);
  const [loading, setLoading] = useState(false);
  const lengths = parsedData.map((item) =>
  item.sequence ? item.sequence.length : Object.values(item)[0].length);


  // Handle file selection
  const handleFile = (file: File) => {
  setFileName(file.name);
  setError(null);
  setLoading(true); // Start loading

  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "csv") {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setParsedData(result.data);
        setLoading(false); // Stop loading
      },
      error: () => {
        setError("Error parsing CSV file");
        setLoading(false);
      },
    });
  } else if (ext === "fasta" || ext === "fa") {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const sequences = parseFasta(content);
      setParsedData(sequences);
      setLoading(false); // Stop loading
    };
    reader.readAsText(file);
  } else {
    setError("Unsupported file format. Please upload CSV or FASTA.");
    setLoading(false);
  }
};
  // Simple FASTA parser
  const parseFasta = (text: string) => {
    const sequences: { header: string; sequence: string }[] = [];
    let header = "";
    let seq = "";

    text.split("\n").forEach((line) => {
      if (line.startsWith(">")) {
        if (header) {
          sequences.push({ header, sequence: seq });
        }
        header = line.substring(1).trim();
        seq = "";
      } else {
        seq += line.trim();
      }
    });

    if (header) sequences.push({ header, sequence: seq });
    return sequences;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Sequences</h1>

      <label
        htmlFor="file-upload"
        className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500"
      >
        {fileName ? `Uploaded: ${fileName}` : "Drag & drop or click to select file"}
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </label>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading && (
        <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Processing file...</span>
        </div>
        )}
      {parsedData.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded shadow text-gray-900">
          <h3 className="font-semibold mb-2">Sequence Stats</h3>
          <p>Total Sequences: {stats.total}</p>
          <p>Average Length: {stats.avgLength.toLocaleString()}</p>
          <p>Minimum Length: {stats.minLength.toLocaleString()}</p>
          <p>Maximum Length: {stats.maxLength.toLocaleString()}</p>
          {stats.avgGC !== undefined && <p>Average GC Content: {stats.avgGC}%</p>}
          {stats.avgN !== undefined && <p>Average N Content: {stats.avgN}%</p>}
        </div>

    )}


      {parsedData.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded shadow text-gray-900">
          <h2 className="font-semibold mb-2">Parsed Data</h2>
          <pre className="text-sm overflow-x-auto max-h-64 whitespace-pre-wrap">
            {JSON.stringify(parsedData.slice(0, 3), null, 2)} 
            {parsedData.length > 3 && `\n...and ${parsedData.length - 3} more`}
          </pre>
        </div>
      )}
      {parsedData.length > 0 && lengths.length > 0 && (
        <LengthHistogram lengths={lengths} />
      )}
    </div>
  );
}
