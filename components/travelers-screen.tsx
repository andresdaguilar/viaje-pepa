"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { documents, packing, reservations, travelers } from "@/lib/data";
import type { CheckItem } from "@/lib/types";
import { CodeRow } from "./copy-button";

const storageKey = "viaje-pepa-checks";

const sections = [
  { id: "pasajeros", label: "Pasajeros" },
  { id: "equipaje", label: "Equipaje" },
  { id: "papeles", label: "Papeles" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const boarding = reservations
  .filter((item) => item.checklist)
  .map((item) => ({
    id: item.id,
    title: item.id === "vuelo-ida" ? "Antes del vuelo de ida" : "Antes del vuelo de vuelta",
    items: item.checklist ?? [],
  }));

function allItems(): CheckItem[] {
  return [
    ...documents.items,
    ...packing.flatMap((group) => group.items),
    ...boarding.flatMap((group) => group.items),
  ];
}

function defaults() {
  const base: Record<string, boolean> = {};
  for (const item of allItems()) base[item.id] = item.done;
  return base;
}

const visaFields: { key: "number" | "type" | "issued" | "expires" | "entries"; label: string }[] = [
  { key: "number", label: "Número" },
  { key: "type", label: "Tipo" },
  { key: "issued", label: "Emisión" },
  { key: "expires", label: "Vencimiento" },
  { key: "entries", label: "Entradas" },
];

export function TravelersScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("seccion");
  const section: SectionId = sections.some((item) => item.id === requested) ? (requested as SectionId) : "pasajeros";
  const [checks, setChecks] = useState<Record<string, boolean>>(defaults);

  function openSection(id: SectionId) {
    router.replace(id === "pasajeros" ? "/viajeros" : `/viajeros?seccion=${id}`, { scroll: false });
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      setChecks({ ...defaults(), ...(JSON.parse(saved) as Record<string, boolean>) });
    } catch {
      setChecks(defaults());
    }
  }, []);

  function done(id: string, fallback: boolean) {
    return id in checks ? checks[id] : fallback;
  }

  function toggle(id: string, fallback: boolean) {
    const next = { ...checks, [id]: !done(id, fallback) };
    setChecks(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const packingPending = packing
    .flatMap((group) => group.items)
    .filter((item) => !done(item.id, item.done)).length;
  const papersPending = [...documents.items, ...boarding.flatMap((group) => group.items)].filter(
    (item) => !done(item.id, item.done),
  ).length;

  return (
    <>
      <p className="lede" style={{ margin: "4px 0 12px" }}>
        Pasaportes, papeles y lo que falta empacar. Los tildes quedan guardados en este teléfono.
      </p>
      <div className="chips" role="tablist" aria-label="Datos del viaje">
        {sections.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={section === item.id}
            className={section === item.id ? "on" : undefined}
            onClick={() => openSection(item.id)}
          >
            {item.label}
            {item.id === "equipaje" && packingPending > 0 ? ` · ${packingPending}` : ""}
            {item.id === "papeles" && papersPending > 0 ? ` · ${papersPending}` : ""}
          </button>
        ))}
      </div>

      {section === "pasajeros" ? (
        travelers.map((traveler) => (
          <article key={traveler.id} className="person">
            <div className="spread">
              <h2>{traveler.name}</h2>
              <span className="muted">{traveler.role}</span>
            </div>
            <div className="facts">
              {traveler.facts.map((fact) => (
                <CodeRow key={fact.label} label={fact.label} value={fact.value} />
              ))}
            </div>
            <div className="visa">
              <p className="section-label">Visa de Estados Unidos</p>
              {visaFields
                .filter((field) => traveler.visa[field.key])
                .map((field) => (
                  <CodeRow key={field.key} label={field.label} value={traveler.visa[field.key]} />
                ))}
            </div>
          </article>
        ))
      ) : null}

      {section === "equipaje" ? (
        <>
          <div className="panel" style={{ padding: "12px 14px", marginBottom: 8 }}>
            <strong>Vuelo de vuelta</strong>
            <p className="muted" style={{ margin: "4px 0 0" }}>
              Ítem personal 3 kg. Carry-on 10 kg. Sin valija de bodega incluida.
            </p>
          </div>
          {packing.map((group) => {
            const ready = group.items.filter((item) => done(item.id, item.done)).length;
            return (
              <section key={group.id}>
                <p className="section-label">
                  {group.title} · {ready}/{group.items.length}
                </p>
                <div className="panel" style={{ padding: "4px 12px" }}>
                  {group.items.map((item) => (
                    <Check
                      key={item.id}
                      label={item.label}
                      on={done(item.id, item.done)}
                      onToggle={() => toggle(item.id, item.done)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      ) : null}

      {section === "papeles" ? (
        <>
          <p className="section-label">
            Documentación · {documents.items.filter((item) => done(item.id, item.done)).length}/{documents.items.length}
          </p>
          <div className="panel" style={{ padding: "4px 12px" }}>
            {documents.items.map((item) => (
              <Check
                key={item.id}
                label={item.label}
                on={done(item.id, item.done)}
                onToggle={() => toggle(item.id, item.done)}
              />
            ))}
          </div>
          {boarding.map((group) => (
            <section key={group.id}>
              <p className="section-label">{group.title}</p>
              <div className="panel" style={{ padding: "4px 12px" }}>
                {group.items.map((item) => (
                  <Check
                    key={item.id}
                    label={item.label}
                    on={done(item.id, item.done)}
                    onToggle={() => toggle(item.id, item.done)}
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      ) : null}
    </>
  );
}

function Check({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" className={on ? "check on" : "check"} onClick={onToggle} aria-pressed={on}>
      <i aria-hidden>{on ? "✓" : ""}</i>
      <span>{label}</span>
    </button>
  );
}
