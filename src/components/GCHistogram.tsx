"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";

interface GCHistogramProps {
  values: number[];
}

export default function GCHistogram({ values }: GCHistogramProps) {
  if (!values.length) {
    return (
      <div className="w-full h-32 mt-6 bg-white p-4 rounded shadow flex items-center justify-center">
        <p className="text-gray-700">GC content distribution not available (CSV or no sequences).</p>
      </div>
    );
  }

  if (values.length === 1) {
    return (
      <div className="w-full h-32 mt-6 bg-white p-4 rounded shadow flex items-center justify-center">
        <p className="text-gray-700">
          Only one sequence uploaded (GC Content: {values[0].toFixed(2)}%)
        </p>
      </div>
    );
  }

  const bucketCount = 10;
  const bucketSize = 100 / bucketCount;
  const buckets: { name: string; count: number }[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const start = i * bucketSize;
    const end = start + bucketSize;
    const count = values.filter((gc) => gc >= start && gc < end).length;
    buckets.push({ name: `${start.toFixed(0)}-${end.toFixed(0)}%`, count });
  }

  return (
    <div className="w-full h-64 mt-6 bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">GC Content Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
