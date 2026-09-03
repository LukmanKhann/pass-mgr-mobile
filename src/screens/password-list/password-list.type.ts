import type { IPasswordItem } from '../../global/types/common.type';

export type IViewMode = 'grid' | 'list';
export type ISortOrder = 'asc' | 'desc';

export interface IPasswordListCategory {
  id: string;
  name: string;
  count: number;
}

export interface IPasswordItemProps {
  item: IPasswordItem;
  viewMode: IViewMode;
  passwordVisible: boolean;
  loading: boolean;
  onTogglePasswordVisibility: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCopyUsername: (username: string) => void;
  onCopyPassword: (password: string) => void;
}
