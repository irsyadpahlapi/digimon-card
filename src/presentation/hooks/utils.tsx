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
