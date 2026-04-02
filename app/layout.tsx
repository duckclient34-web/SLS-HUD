import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Fuck SLS HUD",
  description: "A simple site to list scripts and fastflags",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="container">
            <header className="header">
              <a className="brand" href="/">
                Fuck SLS HUD
              </a>
              <nav className="nav">
                <a href="/#scripts">Scripts</a>
              </nav>
            </header>

            {children}

            <footer className="footer">
              <span>© {new Date().getFullYear()} Fuck SLS HUD</span>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
