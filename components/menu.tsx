"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { itinerary, places, reservations } from "@/lib/data";
import { formatShortDay } from "@/lib/format";

const sections = [
  { href: "/", label: "Itinerario" },
  { href: "/reservas", label: "Reservas" },
  { href: "/lugares", label: "Lugares" },
  { href: "/mapa", label: "Mapa" },
  { href: "/viajeros", label: "Pasajeros" },
  { href: "/viajeros?seccion=equipaje", label: "Equipaje" },
  { href: "/viajeros?seccion=papeles", label: "Documentación" },
];

export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const search = params.toString();
  const skipClose = useRef(true);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (skipClose.current) {
      skipClose.current = false;
      return;
    }
    closeRef.current();
  }, [pathname, search]);

  if (!open) return null;

  function current(href: string) {
    const [path, query] = href.split("?");
    if (query) {
      const wanted = new URLSearchParams(query).get("seccion");
      return pathname === path && params.get("seccion") === wanted;
    }
    if (path === "/viajeros") return pathname === "/viajeros" && !params.get("seccion");
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <>
      <button type="button" className="backdrop" aria-label="Cerrar menú" onClick={onClose} />
      <nav className="drawer" id="menu" aria-label="Accesos directos">
        <div className="spread">
          <strong>Accesos</strong>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar menú">
            <CloseIcon />
          </button>
        </div>
        <p className="section-label">Secciones</p>
        <div className="menu-list">
          {sections.map((item) => (
            <Link key={item.href} href={item.href} className={current(item.href) ? "on" : undefined}>
              {item.label}
            </Link>
          ))}
        </div>
        <p className="section-label">Itinerario</p>
        <div className="menu-list">
          {itinerary.map((item) => (
            <Link
              key={item.id}
              href={`/itinerario/${item.id}`}
              className={pathname === `/itinerario/${item.id}` ? "on" : undefined}
            >
              <small>
                {formatShortDay(item.date)} · {item.time}
              </small>
              {item.title}
            </Link>
          ))}
        </div>
        <p className="section-label">Reservas</p>
        <div className="menu-list">
          {reservations.map((item) => (
            <Link
              key={item.id}
              href={`/reservas/${item.id}`}
              className={pathname === `/reservas/${item.id}` ? "on" : undefined}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <p className="section-label">Lugares</p>
        <div className="menu-list">
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/lugares/${place.id}`}
              className={pathname === `/lugares/${place.id}` ? "on" : undefined}
            >
              <small>{place.category}</small>
              {place.name}
            </Link>
          ))}
        </div>
        <button
          type="button"
          className="btn secondary lock-out"
          onClick={async () => {
            await fetch("/api/salir", { method: "POST" });
            window.location.assign("/entrar");
          }}
        >
          Bloquear
        </button>
      </nav>
    </>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
