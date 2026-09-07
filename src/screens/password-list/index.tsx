import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/use-theme.hook';
import { EmptyState } from '../../components/widgets/empty-state';
import { usePasswordList } from './hooks/use-password-list.hook';
import { EditPasswordModal } from './components/edit-password-modal.component';
import { PasswordItem } from './components/password-item.component';
import { PasswordListHeader } from './components/password-list-header.component';
import { SCREENS } from '../../navigation/navigation.constant';

import type { IPasswordItem } from '../../global/types/common.type';
import type { ISortOrder } from './password-list.type';
import type { IVaultStackParamList } from '../../navigation/navigation.type';

type Props = NativeStackScreenProps<IVaultStackParamList, 'Vault'>;

export default function PasswordListScreen({ navigation }: Props): JSX.Element {
  const { colors } = useTheme();
  const {
    filteredPasswords,
    loading,
    refreshing,
    searchQuery,
    modalVisible,
    modalPasswordVisible,
    passwordVisible,
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
  } = usePasswordList();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<ISortOrder>('none');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: (e: { nativeEvent: { text: string } }) =>
          handleSearch(e.nativeEvent.text),
        onCancelButtonPress: () => handleSearch(''),
        onFocus: () => setIsSearchFocused(true),
        onBlur: () => setIsSearchFocused(false),
      },
    });
  }, [navigation, handleSearch]);

  const getPasswordsByCategory = useCallback(
    (cat: string): IPasswordItem[] =>
      filteredPasswords.filter(
        item => item.category?.toLowerCase() === cat.toLowerCase(),
      ),
    [filteredPasswords],
  );

  const getFilteredData = useCallback((): IPasswordItem[] => {
    let data = filteredPasswords;
    if (selectedCategory !== 'all') {
      data = data.filter(
        item => item.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }
    if (sortOrder === 'none') {
      return data;
    }
    return [...data].sort((a: IPasswordItem, b: IPasswordItem) => {
      const titleA = (a.title || 'Untitled').toLowerCase();
      const titleB = (b.title || 'Untitled').toLowerCase();
      return sortOrder === 'asc'
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    });
  }, [filteredPasswords, selectedCategory, sortOrder]);

  const handleSortChange = (order: ISortOrder) => {
    setSortOrder(order);
  };

  const displayData = getFilteredData();
  const isFiltering =
    searchQuery.trim().length > 0 || selectedCategory !== 'all';

  const renderItem = ({ item }: { item: IPasswordItem }) => (
    <PasswordItem
      item={item}
      passwordVisible={!!passwordVisible[item.id]}
      loading={loading}
      onTogglePasswordVisibility={togglePasswordVisibility}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCopyUsername={copyUsername}
      onCopyPassword={copyPassword}
    />
  );

  const renderEmptyState = () =>
    isFiltering ? (
      <EmptyState
        icon="search"
        title="No matches found"
        message="Try a different search or category"
      />
    ) : (
      <EmptyState
        icon="shield_lock"
        title="No passwords yet"
        message="Tap the + button to add your first password"
        actionTitle="Add Password"
        onActionPress={() =>
          navigation.getParent()?.navigate(SCREENS.ADD_CREDENTIAL_TAB)
        }
      />
    );

  return (
    <>
      <PasswordListHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredPasswords={filteredPasswords}
        getPasswordsByCategory={getPasswordsByCategory}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        isSearchFocused={isSearchFocused}
      />

      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={displayData}
          renderItem={renderItem}
          keyExtractor={(item: IPasswordItem) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          ListEmptyComponent={renderEmptyState()}
          contentContainerStyle={
            displayData.length === 0 ? styles.emptyList : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
          contentInsetAdjustmentBehavior="automatic"
        />

        <EditPasswordModal
          visible={modalVisible}
          onDismiss={closeModal}
          onSave={handleSaveChanges}
          title={title}
          username={username}
          password={password}
          category={category}
          passwordVisible={modalPasswordVisible}
          onTogglePasswordVisibility={setModalPasswordVisible}
          loading={loading}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});
