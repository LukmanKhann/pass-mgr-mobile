import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../hooks/use-theme.hook';
import { borderRadius } from '../theme/spacing.theme';

export type SkeletonVariant = 'rect' | 'circle' | 'text' | 'card';

export interface ISkeletonProps {
  /** Shape of the shimmer placeholder. */
  variant?: SkeletonVariant;
  style?: ViewStyle | ViewStyle[];
  /** Rounded corners override (defaults to the theme radius). */
  radius?: number;
}

/**
 * A shimmering loading placeholder. It pulses opacity between the theme's
 * `skeleton` and `skeletonHighlight` tokens so it blends with its surface.
 * Uses the RN core `Animated` primitive — no extra dependency.
 */
export function Skeleton({
  variant = 'rect',
  style,
  radius,
}: ISkeletonProps): JSX.Element {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const shapeStyles: Record<SkeletonVariant, ViewStyle> = {
    rect: { width: 100, height: 16 },
    circle: { width: 40, height: 40, borderRadius: radius ?? borderRadius.full },
    text: { width: '100%', height: 14 },
    card: { width: 100, height: 64, borderRadius: radius ?? borderRadius.lg },
  };

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.skeleton, opacity },
        { borderRadius: radius ?? borderRadius.md },
        shapeStyles[variant],
        style,
      ]}
    />
  );
}