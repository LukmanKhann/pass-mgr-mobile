import { useCallback, useContext, useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { Alert } from 'react-native';

import { CustomSnackbar } from '../../../global/utils/snackbar.util';
import PasswordContext from '../../../context/PasswordContext/password-context.component';
import type { IPasswordItem } from '../../../global/types/common.type';

interface IPasswordListState {
  filteredPasswords: IPasswordItem[];
  loading: boolean;
  refreshing: boolean;
  searchQuery: string;
  modalVisible: boolean;
  modalPasswordVisible: boolean;
  passwordVisible: Record<string, boolean>;
  editId: string;
  title: string;
  username: string;
  password: string;
  category: string;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleSaveChanges: (values: IPasswordItem) => Promise<void>;
  onRefresh: () => Promise<void>;
  handleSearch: (query: string) => void;
  closeModal: () => void;
  togglePasswordVisibility: (id: string) => void;
  copyUsername: (username: string) => void;
  copyPassword: (password: string) => void;
  setModalPasswordVisible: (value: boolean) => void;
}

export function usePasswordList(): IPasswordListState {
  const { passwords, editPassword, deletePassword, loadPasswords } =
    useContext(PasswordContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState('');
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState<IPasswordItem[]>(passwords);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = passwords.filter(
        item =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredPasswords(filtered);
    } else {
      setFilteredPasswords(passwords);
    }
  }, [passwords, searchQuery]);

  const showSnackbar = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
      CustomSnackbar[type](message);
    },
    [],
  );

  const handleEdit = useCallback(
    (id: string) => {
      const passwordToEdit = passwords.find(item => item.id === id);
      if (passwordToEdit) {
        setEditId(id);
        setTitle(passwordToEdit.title || '');
        setUsername(passwordToEdit.username || '');
        setPassword(passwordToEdit.password || '');
        setCategory(passwordToEdit.category || 'others');
        setModalVisible(true);
      }
    },
    [passwords],
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete Password', 'Are you sure you want to delete this password?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deletePassword(id);
              showSnackbar('Password deleted successfully', 'success');
            } catch (error) {
              showSnackbar('Failed to delete password', 'error');
            } finally {
              setLoading(false);
            }
          },
        },
      ], { cancelable: true });
    },
    [deletePassword, showSnackbar],
  );

  const handleSaveChanges = useCallback(
    async (values: IPasswordItem) => {
      try {
        setLoading(true);
        await editPassword(
          editId,
          values.title,
          values.username,
          values.password,
          values.category ?? 'others',
        );
        setModalVisible(false);
        setModalPasswordVisible(false);
        showSnackbar('Password updated successfully', 'success');
        setEditId('');
        setTitle('');
        setUsername('');
        setPassword('');
        setCategory('');
      } catch (error) {
        showSnackbar('Failed to update password', 'error');
      } finally {
        setLoading(false);
      }
    },
    [editId, editPassword, showSnackbar],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPasswords();
    } catch (error) {
      showSnackbar('Failed to refresh passwords', 'error');
    } finally {
      setRefreshing(false);
    }
  }, [loadPasswords, showSnackbar]);

  const copyUsername = useCallback(
    (itemUsername: string) => {
      if (!itemUsername) {
        showSnackbar('No username to copy', 'error');
        return;
      }
      Clipboard.setString(itemUsername);
      showSnackbar('Username copied to clipboard', 'success');
    },
    [showSnackbar],
  );

  const copyPassword = useCallback(
    (itemPassword: string) => {
      if (!itemPassword) {
        showSnackbar('No password to copy', 'error');
        return;
      }
      Clipboard.setString(itemPassword);
      showSnackbar('Password copied to clipboard', 'success');
    },
    [showSnackbar],
  );

  const togglePasswordVisibility = useCallback((id: string) => {
    setPasswordVisible(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setModalPasswordVisible(false);
    setEditId('');
    setTitle('');
    setUsername('');
    setPassword('');
    setCategory('');
  }, []);

  return {
    filteredPasswords,
    loading,
    refreshing,
    searchQuery,
    modalVisible,
    modalPasswordVisible,
    passwordVisible,
    editId,
    title,
    username,
    password,
    category,
    handleEdit,
    handleDelete,
    handleSaveChanges,
    onRefresh,
    handleSearch,
    closeModal,
    togglePasswordVisibility,
    copyUsername,
    copyPassword,
    setModalPasswordVisible,
  };
}
