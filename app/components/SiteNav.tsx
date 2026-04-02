"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/#scripts", label: "Scripts" },
  { href: "/#fflags", label: "Fflags" },
  { href: "/login", label: "Login" },
] as const;

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="nav-main" aria-label="Main">
      {nav.map(({ href, label }) => {
        const isActive =
          href === "/"
            ? pathname === "/"
            : href === "/login"
            ? pathname === "/login"
            : false;

        return (
          <Link
            key={`${href}-${label}`}
            href={href}
            className={isActive ? "nav-link nav-link-active" : "nav-link"}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
