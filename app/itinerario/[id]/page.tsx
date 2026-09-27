import Link from "next/link";
import { notFound } from "next/navigation";
import { itinerary, itineraryById, placeById, reservationById } from "@/lib/data";
import { formatDay, mapsUrl } from "@/lib/format";

export function generateStaticParams() {
  return itinerary.map((item) => ({ id: item.id }));
}

export default async function ItineraryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = itineraryById(id);
  if (!item) notFound();
  const place = placeById(item.placeId);
  const reservation = reservationById(item.reservationId);

  return (
    <article className="detail">
      <Link href="/" className="back">
        ← Itinerario
      </Link>
      <p className="kicker">
        {formatDay(item.date)} · {item.time}
        {item.endTime ? ` – ${item.endTime}` : ""} · hora de {item.clock}
      </p>
      <h1>{item.title}</h1>
      <p className="summary">{item.summary}</p>
      {item.plan ? (
        <>
          <p className="section-label">Plan</p>
          <ol className="plan">
            {item.plan.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </>
      ) : null}
      <div className="actions">
        {place ? (
          <Link className="btn" href={`/lugares/${place.id}`}>
            Ver lugar
          </Link>
        ) : null}
        {reservation ? (
          <Link className={place ? "btn secondary" : "btn"} href={`/reservas/${reservation.id}`}>
            Ver reserva
          </Link>
        ) : null}
        {place ? (
          <a className="btn secondary" href={mapsUrl(place.address)} target="_blank" rel="noreferrer">
            Cómo llegar
          </a>
        ) : null}
      </div>
    </article>
  );
}
