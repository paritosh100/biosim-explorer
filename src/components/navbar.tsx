"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-700">
          BioSim Explorer
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/upload" className="text-gray-700 hover:text-blue-600">
            Genomic Classifier
          </Link>
          <Link href="/explore" className="text-gray-700 hover:text-green-600">
            Optimization Explorer
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="flex flex-col items-center mt-4 space-y-4 md:hidden">
          <Link
            href="/upload"
            className="text-gray-700 hover:text-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Genomic Classifier
          </Link>
          <Link
            href="/explore"
            className="text-gray-700 hover:text-green-600"
            onClick={() => setMenuOpen(false)}
          >
            Optimization Explorer
          </Link>
        </div>
      )}
    </nav>
  );
}
