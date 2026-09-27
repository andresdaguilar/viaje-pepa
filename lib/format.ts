const dayFormat = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const shortDayFormat = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "numeric",
  timeZone: "UTC",
});

const monthDayFormat = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function parseDay(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`);
}

export function formatDay(isoDate: string) {
  const label = dayFormat.format(parseDay(isoDate));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatShortDay(isoDate: string) {
  return shortDayFormat.format(parseDay(isoDate)).replace(".", "");
}

export function formatMonthDay(isoDate: string) {
  return monthDayFormat.format(parseDay(isoDate));
}

export function formatRange(start: string, end?: string) {
  if (!end || end === start) return formatMonthDay(start);
  return `${formatMonthDay(start)} – ${formatMonthDay(end)}`;
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function addDays(isoDate: string, days: number) {
  const date = parseDay(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function eachDay(start: string, end: string) {
  const days: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

export const TRIP_START = "2026-09-29";
export const TRIP_END = "2026-10-10";
