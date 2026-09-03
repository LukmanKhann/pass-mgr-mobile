import React, { useState } from 'react';
import { FlatList, RefreshControl, StatusBar, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';

import { useTheme } from '../../hooks/use-theme.hook';
import { EmptyState } from '../../components/widgets/empty-state';
import type { IPasswordItem } from '../../global/types/common.type';
import { usePasswordList } from './hooks/use-password-list.hook';
import { EditPasswordModal } from './components/edit-password-modal.component';
import { PasswordItem } from './components/password-item.component';
import { PasswordListHeader } from './components/password-list-header.component';
import { PasswordListSearchBar } from './components/password-list-search-bar.component';
import type { ISortOrder, IViewMode } from './password-list.type';

interface IProps {
  navigation: { navigate: (screen: string) => void };
}

export default function PasswordListScreen({ navigation }: IProps): JSX.Element {
  const { colors, isDark } = useTheme();
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
  const [viewMode, setViewMode] = useState<IViewMode>('grid');
  const [sortOrder, setSortOrder] = useState<ISortOrder>('asc');

  const getPasswordsByCategory = (cat: string): IPasswordItem[] =>
    filteredPasswords.filter(
      item => item.category?.toLowerCase() === cat.toLowerCase(),
    );

  const getFilteredData = (): IPasswordItem[] => {
    let data = filteredPasswords;
    if (selectedCategory !== 'all') {
      data = data.filter(
        item => item.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }
    return [...data].sort((a: IPasswordItem, b: IPasswordItem) => {
      const titleA = (a.title || 'Untitled').toLowerCase();
      const titleB = (b.title || 'Untitled').toLowerCase();
      return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });
  };

  const handleSortChange = (order: ISortOrder) => {
    setSortOrder(order);
  };

  const displayData = getFilteredData();

  const renderItem = ({ item }: { item: IPasswordItem }) => (
    <PasswordItem
      item={item}
      viewMode={viewMode}
      passwordVisible={!!passwordVisible[item.id]}
      loading={loading}
      onTogglePasswordVisibility={togglePasswordVisibility}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCopyUsername={copyUsername}
      onCopyPassword={copyPassword}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <PasswordListSearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <PasswordListHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredPasswords={filteredPasswords}
        getPasswordsByCategory={getPasswordsByCategory}
      />

      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={(item: IPasswordItem) => item.id}
        key={`${viewMode}-${sortOrder}`}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title={searchQuery || selectedCategory !== 'all' ? 'No matches found' : 'No Passwords Yet'}
            message={
              searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Tap the + button to add your first password'
            }
          />
        }
        contentContainerStyle={
          displayData.length === 0 ? styles.emptyList : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
      />

      <FAB
        style={[styles.fab, { backgroundColor: colors.accent }]}
        icon="plus"
        onPress={() => navigation.navigate('AddCredential')}
        color={colors.textOnAccent}
        disabled={loading}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex:  1,
  },
  gridRow: {
    gap:  12,
    paddingHorizontal:  16,
  },
  listContent: {
    paddingBottom:  100,
    paddingHorizontal:  16,
  },
  emptyList: {
    flex:  1,
  },
  fab: {
    position: 'absolute',
    right:  16,
    bottom:  24,
  },
});
