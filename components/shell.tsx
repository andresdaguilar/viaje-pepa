"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const items = [
  { href: "/", label: "Itinerario", icon: Calendar },
  { href: "/reservas", label: "Reservas", icon: Ticket },
  { href: "/lugares", label: "Lugares", icon: Pin },
  { href: "/viajeros", label: "Datos", icon: People },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app">
      <header className="topbar">
        <Link href="/" className="brand">
          <small>29 sep – 10 oct</small>
          <strong>Orlando</strong>
        </Link>
      </header>
      <main className="main">{children}</main>
      <nav className="nav" aria-label="Secciones">
        {items.map((item) => {
          const on =
            item.href === "/"
              ? pathname === "/" || pathname.startsWith("/itinerario")
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={on ? "on" : undefined} aria-current={on ? "page" : undefined}>
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Calendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" />
    </svg>
  );
}

function Ticket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 8.5a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 1 0 4v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a2 2 0 0 1 0-4v-2Z" />
      <path d="M12 7.5v9" strokeDasharray="2 2" />
    </svg>
  );
}

function People() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="9" cy="8" r="2.4" />
      <path d="M4.5 18.5c.5-2.6 2.2-4 4.5-4s4 1.4 4.5 4" />
      <circle cx="16" cy="9" r="2" />
      <path d="M15 14.6c1.6.3 2.8 1.4 3.4 3.4" />
    </svg>
  );
}

function Pin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="1.8" />
    </svg>
  );
}
