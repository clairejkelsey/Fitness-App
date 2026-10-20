export function toISODate(d: Date): string {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 10);
}

export function mostRecentSunday(d: Date = new Date()): string {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  return toISODate(copy);
}

export function weekIndexFor(programStartDate: string, weekStart: string): number {
  const start = new Date(programStartDate + "T00:00:00");
  const cur = new Date(weekStart + "T00:00:00");
  const diffDays = Math.round((cur.getTime() - start.getTime()) / 86400000);
  return Math.floor(diffDays / 7) + 1;
}

export function formatDateRange(weekStart: string): string {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
