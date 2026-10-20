import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Behind the Grades",
  description:
    "Structured, honest feedback from past IE students so you can choose courses and professors with confidence.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <span className="wordmark wordmark-sm">Behind the Grades</span>
            <p>
              Student opinions, not official evaluations. The catalog uses sample data: universities,
              schools and degrees are placeholders, and professors and courses are fictional.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
