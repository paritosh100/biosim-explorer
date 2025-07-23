export function calculateGC(sequence: string): number {
  if (!sequence) return 0;
  const gc = (sequence.match(/[GC]/gi) || []).length;
  return (gc / sequence.length) * 100;
}

export function calculateNContent(sequence: string): number {
  if (!sequence) return 0;
  const nCount = (sequence.match(/[N]/gi) || []).length;
  return (nCount / sequence.length) * 100;
}

export function getSequenceStats(data: any[]): {
  total: number;
  avgLength: number;
  minLength: number;
  maxLength: number;
  avgGC?: number;
  avgN?: number;
} {
  if (!data.length) {
    return { total: 0, avgLength: 0, minLength: 0, maxLength: 0 };
  }

  const isFasta = data[0].sequence !== undefined;

  let lengths: number[] = [];
  let gcSum = 0;
  let nSum = 0;

  data.forEach((item) => {
    const seq = isFasta ? item.sequence : Object.values(item)[0]; // CSV: first column
    lengths.push(seq.length);

    if (isFasta) {
      gcSum += calculateGC(seq);
      nSum += calculateNContent(seq);
    }
  });

  const total = data.length;
  const avgLength = lengths.reduce((a, b) => a + b, 0) / total;
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);

  return {
    total,
    avgLength: Math.round(avgLength),
    minLength,
    maxLength,
    avgGC: isFasta ? parseFloat((gcSum / total).toFixed(2)) : undefined,
    avgN: isFasta ? parseFloat((nSum / total).toFixed(2)) : undefined,
  };
}
