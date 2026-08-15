/**
 * Filters a list of items by a search term across a fixed set of fields.
 * Skips the scan entirely when the term is empty.
 */
export function filterBySearch(items, term, fields) {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) =>
    fields.some((field) => item[field]?.toLowerCase().includes(normalized))
  );
}
