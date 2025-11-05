const STATER_PACK_ITEMS = [
  {
    id: 1,
    name: 'Common',
    type: 'C',
    price: 5,
    image: '/images/common.png',
    description:
      'Perfect for beginners! Get 4 Rookie cards to start your collection and 1 Champion to lead your team into battle.',
  },
  {
    id: 2,
    name: 'Ballance',
    type: 'B',
    price: 10,
    image: '/images/balance.png',
    description:
      'The smart choice! Build a balanced deck with 2 Rookies, 2 Champions, and your first Ultimate card. Great value for strategic players!',
  },
  {
    id: 3,
    name: 'Advanced',
    type: 'A',
    price: 15,
    image: '/images/advance.png',
    description:
      'Power up your game! Unlock advanced strategies with 1 Rookie, 2 Champions, and 2 powerful Ultimate cards. Dominate the battlefield!',
  },
  {
    id: 4,
    name: 'Rare',
    type: 'R',
    price: 20,
    image: '/images/rare.png',
    description:
      'The ultimate pack! Experience legendary power with 1 Champion, 2 Ultimates, and 1 exclusive Mega card. For serious collectors only!',
  },
];

export const gradientMap: { [key: string]: string } = {
  C: 'from-gray-400 via-gray-500 to-gray-600',
  B: 'from-blue-400 via-blue-500 to-blue-600',
  A: 'from-purple-400 via-purple-500 to-purple-600',
  R: 'from-yellow-400 via-orange-500 to-red-600',
};

export const borderMap: { [key: string]: string } = {
  C: 'border-gray-400',
  B: 'border-blue-400',
  A: 'border-purple-400',
  R: 'border-yellow-400',
};

export const badgeMap: { [key: string]: string } = {
  C: 'bg-gray-500',
  B: 'bg-blue-500',
  A: 'bg-purple-500',
  R: 'bg-gradient-to-r from-yellow-400 to-orange-500',
};

export const Cateogory = ['Rookie', 'Champion', 'Ultimate', 'Mega'];

export default STATER_PACK_ITEMS;
