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
