import Link from "next/link";
import { notFound } from "next/navigation";
import { itinerary, placeById, places } from "@/lib/data";
import { mapsUrl } from "@/lib/format";
import type { Priority } from "@/lib/types";

const priorityLabel: Record<Priority, string> = {
  imperdible: "Imperdible",
  si: "Sí",
  opcional: "Opcional",
  paso: "Paso",
};

export function generateStaticParams() {
  return places.map((place) => ({ id: place.id }));
}

export default async function PlaceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = placeById(id);
  if (!place) notFound();
  const visits = itinerary.filter((item) => item.placeId === place.id);

  return (
    <article className="detail">
      <Link href="/lugares" className="back">
        ← Lugares
      </Link>
      <p className="kicker">{place.category}</p>
      <h1>{place.name}</h1>
      <p className="summary">{place.blurb}</p>
      <div className="meta">
        <div>
          <small>Zona</small>
          <strong>{place.area}</strong>
        </div>
        <div>
          <small>Dirección</small>
          <strong>{place.address}</strong>
        </div>
        {place.hours ? (
          <div>
            <small>Horario en el plan</small>
            <strong>{place.hours}</strong>
          </div>
        ) : null}
      </div>
      <p className="section-label">Qué hacer</p>
      <div className="panel" style={{ padding: "4px 14px" }}>
        {place.highlights.map((item) => (
          <div key={item.title} className="highlight">
            <strong>
              {item.title}
              {item.priority ? <span className={`pri ${item.priority}`}>{priorityLabel[item.priority]}</span> : null}
            </strong>
            {item.detail ? <span className="muted">{item.detail}</span> : null}
          </div>
        ))}
      </div>
      {place.tips.length > 0 ? (
        <>
          <p className="section-label">Para tener en cuenta</p>
          <ul className="tips" style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
            {place.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </>
      ) : null}
      {visits.length > 0 ? (
        <>
          <p className="section-label">En el itinerario</p>
          <div className="stack">
            {visits.map((visit) => (
              <Link key={visit.id} href={`/itinerario/${visit.id}`} className="card">
                <h4>
                  {visit.time} · {visit.title}
                </h4>
                <p>{visit.summary}</p>
              </Link>
            ))}
          </div>
        </>
      ) : null}
      <div className="actions">
        <a className="btn" href={mapsUrl(place.address)} target="_blank" rel="noreferrer">
          Cómo llegar
        </a>
        {place.phone ? (
          <a className="btn secondary" href={`tel:${place.phone}`}>
            Llamar
          </a>
        ) : null}
        {place.link ? (
          <a className="btn secondary" href={place.link.href} target="_blank" rel="noreferrer">
            {place.link.label}
          </a>
        ) : null}
      </div>
    </article>
  );
}
