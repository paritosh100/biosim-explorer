"use client";

import { useState } from "react";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import { getSequenceStats, getGCValues, ParsedSequence } from "../../utils/sequenceStats";
import LengthHistogram from "../../components/LengthHistogram";
import GCHistogram from "../../components/GCHistogram";

export default function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  type ParsedSequence = { header: string; sequence: string } | Record<string, string>;
  const [parsedData, setParsedData] = useState<ParsedSequence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle file processing
  const handleFile = (file: File) => {
    setFileName(file.name);
    setError(null);
    setLoading(true);

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result: { data: Record<string, string>[]; }) => {
          setParsedData(result.data as Record<string, string>[]);
          setLoading(false);
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
        setLoading(false);
      };
      reader.readAsText(file);
    } else {
      setError("Unsupported file format. Please upload CSV or FASTA.");
      setLoading(false);
    }
  };

  // FASTA parsing logic
  const parseFasta = (text: string): { header: string; sequence: string }[] => {
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

  // Dropzone setup
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".fa", ".fasta"],
    },
  });

  // Stats & charts data
  const stats = getSequenceStats(parsedData);
  const gcValues = getGCValues(parsedData);
  const lengths = parsedData.map((item) =>
    "sequence" in item
      ? (item as { sequence: string }).sequence.length
      : Object.values(item as Record<string, string>)[0].length
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Sequences</h1>

      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        {fileName ? (
          <p className="text-gray-700">Uploaded: {fileName}</p>
        ) : isDragActive ? (
          <p className="text-blue-600">Drop the file here...</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop a CSV or FASTA file here, or click to browse
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-blue-600">Processing file...</span>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Stats */}
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

      {/* Charts - responsive grid */}
      {parsedData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {lengths.length > 0 && <LengthHistogram lengths={lengths} />}
          <GCHistogram values={gcValues} />
        </div>
      )}
    </div>
  );
}
