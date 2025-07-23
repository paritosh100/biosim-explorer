export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">BioSim Explorer</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        Interactive platform to explore genomic sequence classification and high-dimensional optimization experiments for bioinformatics research.
      </p>

      <div className="flex gap-6">
        <a
          href="/upload"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Genomic Classifier
        </a>
        <a
          href="/explore"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Optimization Explorer
        </a>
      </div>
    </main>
  );
}
