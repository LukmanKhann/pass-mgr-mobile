import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { FAB } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/use-theme.hook';
import MaterialSymbols from '../../components/widgets/material-icon';
import { EmptyState } from '../../components/widgets/empty-state';
import type { IPasswordItem } from '../../global/types/common.type';
import { usePasswordList } from './hooks/use-password-list.hook';
import { EditPasswordModal } from './components/edit-password-modal.component';
import { PasswordItem } from './components/password-item.component';
import { PasswordListHeader } from './components/password-list-header.component';
import type { ISortOrder } from './password-list.type';
import { SCREENS } from '../../navigation/navigation.constant';
import type { IVaultStackParamList } from '../../navigation/navigation.type';

type Props = NativeStackScreenProps<IVaultStackParamList, 'Vault'>;

export default function PasswordListScreen({ navigation }: Props): JSX.Element {
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
  const [sortOrder, setSortOrder] = useState<ISortOrder>('asc');

  // ── Wire native search bar → handleSearch ────────────────────────────────
  // The VaultStackNavigator sets headerSearchBarOptions; here we patch in the
  // callbacks so typing in the native bar feeds the JS search state.
  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: (e: { nativeEvent: { text: string } }) =>
          handleSearch(e.nativeEvent.text),
        onCancelButtonPress: () => handleSearch(''),
      },
      // Refresh icon lives in the native header right slot
      headerRight: () => (
        <TouchableOpacity
          onPress={onRefresh}
          disabled={refreshing}
          hitSlop={10}
          style={{ paddingHorizontal: 8 }}
        >
          <MaterialSymbols name="update" size={22} color={colors.accent} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, onRefresh, refreshing, colors.accent, handleSearch]);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FlatList
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
        ListHeaderComponent={
          // Sort pill stays in-list — no native sort equivalent
          <SortControl sortOrder={sortOrder} onSortChange={handleSortChange}>
            <PasswordListHeader
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              filteredPasswords={filteredPasswords}
              getPasswordsByCategory={getPasswordsByCategory}
            />
          </SortControl>
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
        // Required for the iOS native search bar to scroll-dismiss correctly
        contentInsetAdjustmentBehavior="automatic"
      />

      <FAB
        style={[styles.fab, { backgroundColor: colors.accent }]}
        icon={({ size, color }) => (
          <MaterialSymbols name="add" size={size} color={color} />
        )}
        onPress={() =>
          navigation.getParent()?.navigate(SCREENS.ADD_CREDENTIAL_TAB)
        }
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

// ── Sort-control pill (in-list; no native equivalent) ────────────────────────
interface ISortControlProps {
  sortOrder: ISortOrder;
  onSortChange: (order: ISortOrder) => void;
  children: React.ReactNode;
}

function SortControl({
  sortOrder,
  onSortChange,
  children,
}: ISortControlProps): JSX.Element {
  const { colors, borderRadius, spacing } = useTheme();
  return (
    <View>
      <View
        style={[
          styles.sortRow,
          { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
        ]}
      >
        <TouchableOpacity
          onPress={() => onSortChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={[
            styles.sortButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderLight,
              borderRadius: borderRadius.xl,
              gap: spacing.xs,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialSymbols name="swap_vert" size={18} color={colors.accent} />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});
