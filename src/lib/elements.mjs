const ELEMENT_ALIASES = {
  frost: 'Ice', ice: 'Ice', volt: 'Volt', flame: 'Flame',
  physical: 'Physical', altered: 'Altered',
};

// Preserve the data's element order; do not infer affinity from descriptions.
export function normalizeElements(value) {
  const values = Array.isArray(value) ? value : [value];
  return [...new Set(values.flatMap((element) =>
    typeof element === 'string'
      ? element.split(/[/-]/).map(part => ELEMENT_ALIASES[part.trim().toLowerCase()]).filter(Boolean)
      : []
  ))];
}

export function matchesElement(value, filter) {
  if (filter === 'All') return true;
  const selected = normalizeElements(filter);
  return selected.length === 1 && normalizeElements(value).includes(selected[0]);
}
