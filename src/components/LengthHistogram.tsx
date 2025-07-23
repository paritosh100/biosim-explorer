"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function LengthHistogram({ lengths }: { lengths: number[] }) {
  // Create buckets (e.g., every 100 bases or adaptive)
  if (lengths.length === 1) {
    return (
    <div className="w-full h-32 mt-6 bg-white p-4 rounded shadow flex items-center justify-center">
        <p className="text-gray-700">
            Only one sequence uploaded (Length: {lengths[0].toLocaleString()} bp)
            </p>
    </div>
    );
}

  const maxVal = Math.max(...lengths);
  const bucketCount = 10;
  const bucketSize = Math.ceil(maxVal / bucketCount);
  const buckets: { name: string; count: number }[] = [];

  for (let i = 0; i < bucketCount; i++){
    const start = i * bucketSize;
    const end = start + bucketSize;
    const count = lengths.filter((len) => len >= start && len < end).length;
    buckets.push({ name: `${start}-${end}`, count });
}

  return (
    <div className="w-full h-64 mt-6 bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Length Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
