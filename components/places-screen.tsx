"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { placeCategories, places } from "@/lib/data";
import type { PlaceCategory } from "@/lib/types";

const tone: Record<PlaceCategory, string> = {
  Parques: "parques",
  Compras: "compras",
  Playas: "playas",
  Paseos: "paseos",
  Alojamiento: "alojamiento",
};

export function PlacesScreen() {
  const [category, setCategory] = useState<PlaceCategory | "Todos">("Todos");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((place) => {
      const inCategory = category === "Todos" || place.category === category;
      const haystack = `${place.name} ${place.area} ${place.blurb}`.toLowerCase();
      return inCategory && (q === "" || haystack.includes(q));
    });
  }, [category, query]);

  return (
    <>
      <input
        className="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar parque, outlet, playa…"
        aria-label="Buscar lugares"
        enterKeyHint="search"
      />
      <div className="chips" aria-label="Categorías">
        <button type="button" className={category === "Todos" ? "on" : undefined} onClick={() => setCategory("Todos")}>
          Todos
        </button>
        {placeCategories.map((item) => (
          <button key={item} type="button" className={category === item ? "on" : undefined} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="stack">
        {visible.map((place) => (
          <Link key={place.id} href={`/lugares/${place.id}`} className="place-card">
            <header>
              <span className={`tag ${tone[place.category]}`}>{place.category}</span>
            </header>
            <h3>{place.name}</h3>
            <div className="area">{place.area}</div>
            <p style={{ marginTop: 6 }}>{place.blurb}</p>
          </Link>
        ))}
        {visible.length === 0 ? <p className="empty">Ningún lugar con ese nombre.</p> : null}
      </div>
      <div className="actions">
        <Link className="btn" href="/mapa">
          Ver en el mapa
        </Link>
      </div>
    </>
  );
}
