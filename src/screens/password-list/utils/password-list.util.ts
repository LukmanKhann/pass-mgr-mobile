import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  title: Yup.string().required('Domain is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  category: Yup.string(),
});

export const CATEGORIES = [
  { label: 'Social', value: 'social' },
  { label: 'Work', value: 'work' },
  { label: 'Finance', value: 'finance' },
  { label: 'Games', value: 'games' },
  { label: 'Personal', value: 'personal' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Others', value: 'others' },
];

/**
 * Identity dot colors per category. Chosen as mid-tone hues that keep enough
 * contrast against both the light and the dark surface so the category chips
 * stay legible in either theme.
 */
export const CATEGORY_DOT_COLORS: Record<string, string> = {
  social: '#7C9CF5',
  work: '#E8B46A',
  finance: '#63D29A',
  games: '#B394F2',
  personal: '#F58FAB',
  shopping: '#5ECFE0',
  entertainment: '#C780E8',
  others: '#9CA3AF',
};
