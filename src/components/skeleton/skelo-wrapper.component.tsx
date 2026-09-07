import React from 'react';
import { Skeleton } from 'react-native-skelo';

interface ISkeletonLoaderProps {
  loading: boolean;
  children: React.ReactNode;
  animation?: 'shimmer' | 'pulse' | 'none';
  count?: number;
}

export function SkeletonLoader({
  loading,
  children,
  animation = 'shimmer',
  count = 6,
}: ISkeletonLoaderProps): JSX.Element {
  return (
    <Skeleton loading={loading} animation={animation} count={count}>
      {children}
    </Skeleton>
  );
}
