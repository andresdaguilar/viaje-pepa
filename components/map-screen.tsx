"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { places } from "@/lib/data";
import type { PlaceCategory } from "@/lib/types";
import "leaflet/dist/leaflet.css";

const colors: Record<PlaceCategory, string> = {
  Parques: "#e15a38",
  Compras: "#6b3d86",
  Playas: "#1d5f86",
  Paseos: "#1a6b62",
  Alojamiento: "#8d6430",
};

const filters: Array<PlaceCategory | "Todos"> = ["Todos", "Parques", "Compras", "Playas", "Paseos", "Alojamiento"];

async function loadLeaflet() {
  const mod = await import("leaflet");
  return typeof mod.map === "function" ? mod : mod.default;
}

export function MapScreen() {
  const nodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const [filter, setFilter] = useState<PlaceCategory | "Todos">("Todos");
  const visible = useMemo(
    () => places.filter((place) => filter === "Todos" || place.category === filter),
    [filter],
  );

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    let alive = true;

    (async () => {
      const L = await loadLeaflet();
      if (!alive || !nodeRef.current) return;
      if (!mapRef.current) {
        const map = L.map(nodeRef.current, { zoomControl: true, scrollWheelZoom: false });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        mapRef.current = map;
        layerRef.current = L.layerGroup().addTo(map);
      }
      const map = mapRef.current;
      const layer = layerRef.current;
      if (!map || !layer) return;
      layer.clearLayers();
      const bounds: [number, number][] = [];
      for (const place of visible) {
        bounds.push([place.lat, place.lon]);
        L.circleMarker([place.lat, place.lon], {
          radius: 9,
          color: "#fffdf8",
          weight: 2,
          fillColor: colors[place.category],
          fillOpacity: 1,
        })
          .bindPopup(
            `<strong>${escapeHtml(place.name)}</strong><br/>${escapeHtml(place.area)}<br/><a href="/lugares/${place.id}">Ver lugar</a>`,
          )
          .addTo(layer);
      }
      if (bounds.length === 1) map.setView(bounds[0], 14);
      else if (bounds.length > 1) map.fitBounds(bounds, { padding: [28, 28] });
      map.invalidateSize();
    })();

    return () => {
      alive = false;
    };
  }, [visible]);

  return (
    <div className="map-page">
      <div className="chips" aria-label="Filtrar mapa">
        {filters.map((item) => (
          <button key={item} type="button" className={filter === item ? "on" : undefined} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>
      <div ref={nodeRef} className="map-canvas" role="region" aria-label="Mapa del viaje" />
      <ul className="map-list">
        {visible.map((place) => (
          <li key={place.id}>
            <Link href={`/lugares/${place.id}`}>
              <i style={{ background: colors[place.category] }} />
              {place.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
