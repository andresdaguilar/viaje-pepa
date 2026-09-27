"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { reservationCategories, reservations } from "@/lib/data";
import { formatRange, formatUsd } from "@/lib/format";

export function ReservationsScreen() {
  const [filter, setFilter] = useState<(typeof reservationCategories)[number]["id"]>("todas");
  const visible = useMemo(
    () => reservations.filter((item) => filter === "todas" || item.category === filter),
    [filter],
  );

  return (
    <>
      <div className="chips" role="tablist" aria-label="Tipo de reserva">
        {reservationCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={filter === category.id}
            className={filter === category.id ? "on" : undefined}
            onClick={() => setFilter(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="stack">
        {visible.map((item) => (
          <Link key={item.id} href={`/reservas/${item.id}`} className="ticket">
            <header>
              <span className={`tag ${item.status}`}>{item.status === "pagado" ? "Pagado" : "Pendiente"}</span>
              {item.costUsd != null ? <span className="cost">{formatUsd(item.costUsd)}</span> : null}
            </header>
            <h3>{item.title}</h3>
            <p>{item.provider}</p>
            <p style={{ marginTop: 6 }}>{formatRange(item.start, item.end)} · {item.summary}</p>
            {item.codes[0] ? (
              <div className="code">
                <span>
                  <small className="muted">{item.codes[0].label}</small>
                  <b style={{ display: "block" }}>{item.codes[0].value}</b>
                </span>
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </>
  );
}
