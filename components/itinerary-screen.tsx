"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { itinerary } from "@/lib/data";
import { eachDay, formatDay, formatShortDay, TRIP_END, TRIP_START } from "@/lib/format";
import type { ItineraryItem } from "@/lib/types";

const tripDays = eachDay(TRIP_START, TRIP_END);

function kindOf(item: ItineraryItem) {
  if (item.reservationId?.startsWith("vuelo") || item.id.startsWith("vuelo")) return "vuelo";
  if (item.placeId === "hotel" || item.id === "checkin") return "hotel";
  if (["hollywood", "magic-kingdom", "universal", "islands", "kennedy"].includes(item.placeId ?? "")) return "parque";
  if (["outlets", "florida-mall", "crumbl", "walmart"].includes(item.placeId ?? "")) return "compras";
  if (item.placeId === "cocoa") return "playa";
  return "paseo";
}

const kindLabel: Record<string, string> = {
  vuelo: "Vuelo",
  hotel: "Hotel",
  parque: "Parque",
  compras: "Compras",
  playa: "Playa",
  paseo: "Paseo",
};

export function ItineraryScreen() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const next = useMemo(() => {
    if (now == null) return itinerary[0];
    return itinerary.find((item) => Date.parse(item.instant) >= now) ?? itinerary[itinerary.length - 1];
  }, [now]);

  const todayKey = now == null ? null : new Date(now).toLocaleDateString("en-CA", { timeZone: "America/New_York" });

  useEffect(() => {
    if (!tripDays.includes(next.date)) return;
    document.getElementById(`chip-${next.date}`)?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [next.date]);

  const later = itinerary.filter((item) => item.date > TRIP_END);

  return (
    <>
      <NextCard item={next} upcoming={now != null && Date.parse(next.instant) >= now} />
      <div className="daybar" aria-label="Días del viaje">
        {tripDays.map((day) => {
          const count = itinerary.filter((item) => item.date === day).length;
          return (
            <button
              key={day}
              id={`chip-${day}`}
              type="button"
              className={[count === 0 ? "has-free" : "", day === next.date ? "on" : ""].filter(Boolean).join(" ") || undefined}
              onClick={() => document.getElementById(`day-${day}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <small>{todayKey === day ? "Hoy" : count === 0 ? "Libre" : formatShortDay(day).split(" ")[0]}</small>
              {Number(day.slice(8))}
            </button>
          );
        })}
      </div>
      {tripDays.map((day) => {
        const items = itinerary.filter((item) => item.date === day);
        return (
          <section key={day} id={`day-${day}`} className="day">
            <h3>
              {formatDay(day)}
              {todayKey === day ? <span> · hoy</span> : null}
            </h3>
            {items.length === 0 ? (
              <div className="free">Sin planes. Día libre entre parques.</div>
            ) : (
              <div className="timeline">
                {items.map((item) => (
                  <Slot key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        );
      })}
      {later.length > 0 ? (
        <section className="later">
          <p className="section-label">Después del viaje</p>
          <div className="timeline">
            {later.map((item) => (
              <Slot key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function NextCard({ item, upcoming }: { item: ItineraryItem; upcoming: boolean }) {
  return (
    <Link href={`/itinerario/${item.id}`} className="hero-card">
      <div className="row">
        <span className="kicker">{upcoming ? "Próximo" : "Último"}</span>
        <span className="when">
          {formatShortDay(item.date)} · {item.time}
        </span>
      </div>
      <h2>{item.title}</h2>
      <p className="lede">{item.summary}</p>
    </Link>
  );
}

function Slot({ item }: { item: ItineraryItem }) {
  const kind = kindOf(item);
  return (
    <article className="slot">
      <time dateTime={item.instant}>
        {item.time}
        <i>{item.clock}</i>
      </time>
      <Link href={`/itinerario/${item.id}`} className="card">
        <span className={`tag ${kind}`}>{kindLabel[kind]}</span>
        <h4>{item.title}</h4>
        <p>{item.summary}</p>
      </Link>
    </article>
  );
}
