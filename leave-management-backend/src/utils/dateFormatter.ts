export function formatISODate(isoDateStr: string): string {
  if (!isoDateStr) return "";
  const date = new Date(isoDateStr);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
