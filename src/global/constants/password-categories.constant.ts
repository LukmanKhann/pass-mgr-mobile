export interface IPasswordCategory {
  id: string;
  name: string;
}

export const PASSWORD_CATEGORIES: IPasswordCategory[] = [
  { id: 'all', name: 'All' },
  { id: 'social', name: 'Social' },
  { id: 'work', name: 'Work' },
  { id: 'finance', name: 'Finance' },
  { id: 'games', name: 'Games' },
  { id: 'personal', name: 'Personal' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'others', name: 'Others' },
];
