export const EVENT_TIMEZONE = "America/Belem";

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: EVENT_TIMEZONE,
  });
}

export function formatShortDateParts(date: Date): {
  dia: string;
  mes: string;
  ano: string;
} {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: EVENT_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "--";
  return { dia: get("day"), mes: get("month"), ano: get("year") };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: EVENT_TIMEZONE,
  });
}
