// src/lib/sanitize.ts
// Utility sanitasi input string untuk mencegah XSS & injection pada form customer/staf

/**
 * Membersihkan input teks dari tag HTML atau karakter kontrol berbahaya
 */
export function sanitizeText(str: string): string {
  if (!str) return "";
  return str
    .replace(/[<>]/g, "") // Hapus tag < dan >
    .replace(/javascript:/gi, "") // Hapus pseudo-protokol javascript
    .trim();
}

/**
 * Melakukan HTML escaping pada catatan koki & input komentar
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m] ?? m).trim();
}
