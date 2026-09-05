import type { IPasswordItem } from '../../global/types/common.type';

export type ISortOrder = 'asc' | 'desc' | 'none';

export interface IPasswordListCategory {
  id: string;
  name: string;
  count: number;
}

export interface IPasswordItemProps {
  item: IPasswordItem;
  passwordVisible: boolean;
  loading: boolean;
  onTogglePasswordVisibility: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopyUsername: (username: string) => void;
  onCopyPassword: (password: string) => void;
}
