export const Category = (data: string): string => {
  switch (data) {
    case 'Child':
      return 'Rookie';
    case 'Adult':
      return 'Champion';
    case 'Armor':
      return 'Champion';
    case 'Unknown':
      return 'Champion';
    case 'Hybrid':
      return 'Champion';
    case 'Ultimate':
      return 'Ultimate';
    case 'Perfect':
      return 'Mega';
    default:
      return 'Baby';
  }
};

export const PriceStarterpack = (select: string): number => {
  switch (select) {
    case 'C':
      return 5;
    case 'B':
      return 10;
    case 'A':
      return 15;
    case 'R':
      return 20;
    default:
      return 0;
  }
};

export const sellingDigimonPrice = (category: string, nextEvolutions: boolean): number => {
  if (!nextEvolutions) {
    category = 'God';
  }
  switch (category) {
    case 'Rookie':
      return 5;
    case 'Champion':
      return 10;
    case 'Ultimate':
      return 20;
    case 'Mega':
      return 30;
    case 'God':
      return 100;
    default:
      return 1;
  }
};

// Urutan prioritas level dari terendah → tertinggi
export const LEVEL_ORDER = [
  'Child',
  'Adult',
  'Armor',
  'Unknown',
  'Hybrid',
  'Ultimate',
  'Perfect',
] as const;

// Ambil 1 item dengan prioritas nama tertinggi berdasar LEVEL_ORDER
export const pickHighestByOrder = <T extends { name: string }>(
  items: T[],
  order: readonly string[] = LEVEL_ORDER,
): T | undefined => {
  const rank = new Map(order.map((n, i) => [n, i]));
  let best: T | undefined;
  let bestRank = -1;

  for (const item of items) {
    const r = rank.get(item.name);
    if (r === undefined) continue; // skip yang tidak ada di urutan
    if (r > bestRank) {
      best = item;
      bestRank = r;
    }
  }
  return best;
};

// Dari array levels { level: string } ambil nama level tertinggi
export const highestLevelFromLevels = (levels: Array<{ level: string }>): string => {
  if (!Array.isArray(levels) || levels.length === 0) return '';
  const picked = pickHighestByOrder(levels.map((l) => ({ name: l.level })));
  return picked?.name ?? '';
};

// Untuk data mentah seperti dataresponse (id, name)
export const pickHighestLevelObject = <T extends { id: number; name: string }>(
  items: T[],
): T | undefined => {
  return pickHighestByOrder(items);
};
