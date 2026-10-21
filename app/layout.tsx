import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "RANKED: know your professors before you enroll", template: "%s · RANKED" },
  description:
    "RANKED is where IE University students rank professors and share honest reviews of their classes, school by school.",
  applicationName: "RANKED",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F3E6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>
        <Header />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <Logo />
            <p>
              Student opinions, not official evaluations. Professors, biographies and courses are
              fictional sample data. RANKED is a student project and is not affiliated with IE University.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
