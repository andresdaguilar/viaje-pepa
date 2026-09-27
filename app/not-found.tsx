import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty">
      <p>No encontré esa página.</p>
      <Link href="/" className="btn" style={{ display: "inline-flex", marginTop: 12 }}>
        Volver al itinerario
      </Link>
    </div>
  );
}
