export const regionOrder = [
  'amerique-du-nord',
  'amerique-centrale',
  'amerique-du-sud',
  'caraibes',
] as const;

export type Region = (typeof regionOrder)[number];

export const regionLabels: Record<Region, string> = {
  'amerique-du-nord': 'Amérique du Nord',
  'amerique-centrale': 'Amérique centrale',
  'amerique-du-sud': 'Amérique du Sud',
  caraibes: 'Caraïbes',
};
