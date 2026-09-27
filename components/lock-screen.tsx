"use client";

import { useState, type FormEvent } from "react";

export function LockScreen({ destination }: { destination: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(false);
    const response = await fetch("/api/entrar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError(true);
      setPending(false);
      return;
    }
    window.location.assign(destination);
  }

  return (
    <div className="app">
      <main className="lock">
        <p className="kicker">Viaje</p>
        <h1>Orlando</h1>
        <p className="lede">Para ver el itinerario, las reservas y los datos de los pasajeros.</p>
        <form onSubmit={submit}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="search"
            type="password"
            name="password"
            autoComplete="current-password"
            enterKeyHint="go"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
          {error ? <p className="lock-error">La contraseña no coincide.</p> : null}
          <button className="btn" type="submit" disabled={pending || password.length === 0}>
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </main>
    </div>
  );
}
