import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Script Showcase",
  description: "A simple site to showcase scripts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <a className="brand" href="/">Script Showcase</a>
            <nav className="nav">
              <a href="/#scripts">Scripts</a>
              <a href="/#about">About</a>
            </nav>
          </header>

          {children}

          <footer className="footer">
            <span>© {new Date().getFullYear()} Script Showcase</span>
            <span className="dot">·</span>
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
