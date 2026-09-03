export type IPasswordCategory =
  | 'social'
  | 'work'
  | 'finance'
  | 'games'
  | 'personal'
  | 'shopping'
  | 'entertainment'
  | 'others';

export interface IPasswordItem {
  id: string;
  title: string;
  username: string;
  password: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}
