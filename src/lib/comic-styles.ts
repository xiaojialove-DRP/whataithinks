export type ComicStyle = 'newyorker' | 'japanese' | 'political';

export interface ComicStyleOption {
  id: ComicStyle;
  label: string;
  labelCn: string;
  description: string;
}

export const COMIC_STYLES: ComicStyleOption[] = [
  {
    id: 'newyorker',
    label: 'NEW YORKER',
    labelCn: '纽约客讽刺风',
    description: 'Sophisticated satire with deadpan irony',
  },
  {
    id: 'japanese',
    label: 'JAPANESE',
    labelCn: '日式治愈系',
    description: 'Warm & wholesome slice-of-life humor',
  },
  {
    id: 'political',
    label: 'POLITICAL',
    labelCn: '政治漫画风',
    description: 'Sharp caricature & biting commentary',
  },
];
