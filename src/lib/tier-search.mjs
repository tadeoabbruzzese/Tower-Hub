export function groupTierCharacters(characters, config, searchTerm) {
  const grouped = { 'S+': [], S: [], A: [], B: [], Unranked: [] };
  const search = searchTerm.trim().toLowerCase();
  for (const character of characters) {
    const name = character.simulacrumName || '';
    if (!name.toLowerCase().includes(search)) continue;
    const key = character.id || name.toLowerCase().replace(/\s+/g, '-');
    const tier = config[key] || 'Unranked';
    (grouped[tier] || grouped.Unranked).push(character);
  }
  return grouped;
}
