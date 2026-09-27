import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeRow } from "@/components/copy-button";
import { placeById, reservationById, reservationCategories, reservations } from "@/lib/data";
import { formatRange, formatUsd, mapsUrl } from "@/lib/format";

export function generateStaticParams() {
  return reservations.map((item) => ({ id: item.id }));
}

export default async function ReservationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = reservationById(id);
  if (!item) notFound();
  const place = placeById(item.placeId);
  const category = reservationCategories.find((entry) => entry.id === item.category)?.label;

  return (
    <article className="detail">
      <Link href="/reservas" className="back">
        ← Reservas
      </Link>
      <p className="kicker">{category}</p>
      <h1>{item.title}</h1>
      <p className="summary">{item.summary}</p>
      <div className="meta">
        <div>
          <small>Estado</small>
          <strong>{item.status === "pagado" ? "Pagado" : "Pendiente"}</strong>
        </div>
        <div>
          <small>Cuándo</small>
          <strong>{formatRange(item.start, item.end)}</strong>
        </div>
        {item.costUsd != null ? (
          <div>
            <small>Costo</small>
            <strong>{formatUsd(item.costUsd)}</strong>
          </div>
        ) : null}
      </div>
      {item.codes.length > 0 ? (
        <>
          <p className="section-label">Códigos</p>
          <div className="stack">
            {item.codes.map((code) => (
              <CodeRow key={code.label} label={code.label} value={code.value} />
            ))}
          </div>
        </>
      ) : null}
      <p className="section-label">Datos</p>
      <div className="stack">
        <div className="fact">
          <small>Proveedor</small>
          <strong>{item.provider}</strong>
        </div>
        {item.facts.map((fact) => (
          <div key={fact.label} className="fact">
            <small>{fact.label}</small>
            <strong>{fact.value}</strong>
          </div>
        ))}
      </div>
      {item.notes?.map((note) => (
        <p key={note} className="lede" style={{ marginTop: 12 }}>
          {note}
        </p>
      ))}
      {item.checklist ? (
        <>
          <p className="section-label">Antes de salir</p>
          <ul className="plan">
            {item.checklist.map((check) => (
              <li key={check.id}>
                <span>{check.done ? "✓" : ""}</span>
                {check.label}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="actions">
        {place ? (
          <a className="btn" href={mapsUrl(place.address)} target="_blank" rel="noreferrer">
            Cómo llegar
          </a>
        ) : null}
        {place ? (
          <Link className="btn secondary" href={`/lugares/${place.id}`}>
            Ver lugar
          </Link>
        ) : null}
      </div>
    </article>
  );
}
