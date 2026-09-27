"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className="btn secondary"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? "Copiado" : label}
    </button>
  );
}

export function CodeRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className="code-line"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
      style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}
    >
      <span>
        <small>{label}</small>
        <b>{value}</b>
      </span>
      <small>{done ? "Copiado" : "Copiar"}</small>
    </button>
  );
}
