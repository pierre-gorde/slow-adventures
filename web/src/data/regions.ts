export const regionOrder = ['amerique-du-nord'] as const;

export type Region = (typeof regionOrder)[number];

export const regionLabels: Record<Region, string> = {
  'amerique-du-nord': 'Amérique du Nord',
};
