import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "BioSim Explorer",
  description: "Bioinformatics visualization platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="pt-20 p-6">{children}</main> {/* Added pt-20 */}
      </body>
    </html>
  );
}
