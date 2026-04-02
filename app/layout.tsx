import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import AuthBar from "./components/AuthBar";
import SiteNav from "./components/SiteNav";

export const metadata: Metadata = {
  title: "Fuck SLS HUD",
  description: "Script hub — loaders, fastflags, presets",
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
            <header className="site-header">
              <a className="brand" href="/">
                <span className="brand-mark" aria-hidden="true">
                  SH
                </span>
                Fuck SLS HUD
              </a>

              <SiteNav />

              <div className="header-actions">
                <AuthBar />
              </div>
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
