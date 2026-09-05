import React from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { resolveEnter, resolveExit } from './motion.preset';
import type {
  IMotionBaseProps,
  IMotionTextStyle,
  IMotionViewStyle,
} from './motion.type';

/**
 * Framer Motion for React Native, built on React Native Reanimated 4.
 *
 * `MotionView` and `MotionText` are drop-in Animated replacements that accept
 * Framer-style entrance/exit presets plus a transition descriptor:
 *
 *   <MotionView enter="fade-up" transition={{ spring: 'snappy', delay: 120 }}>
 *     ...
 *   </MotionView>
 *
 * Layout animation is opt-in via `layout` so reordering/reshaping moves
 * smoothly instead of jumping.
 */
export interface IMotionViewProps extends IMotionBaseProps {
  children: React.ReactNode;
  style?: IMotionViewStyle | IMotionViewStyle[];
  /** Smoothly animate between layout changes (Framer `layout`). */
  layout?: boolean;
}

export function MotionView({
  children,
  style,
  enter,
  exit,
  transition,
  layout,
}: IMotionViewProps): JSX.Element {
  const entering = enter !== undefined ? resolveEnter(enter, transition) : undefined;
  const exiting = exit !== undefined ? resolveExit(exit, transition) : undefined;

  return (
    <Animated.View
      style={style}
      layout={layout ? LinearTransition : undefined}
      entering={entering}
      exiting={exiting}
    >
      {children}
    </Animated.View>
  );
}

export interface IMotionTextProps extends IMotionBaseProps {
  children: React.ReactNode;
  style?: IMotionTextStyle | IMotionTextStyle[];
  layout?: boolean;
}

export function MotionText({
  children,
  style,
  enter,
  exit,
  transition,
  layout,
}: IMotionTextProps): JSX.Element {
  const entering = enter !== undefined ? resolveEnter(enter, transition) : undefined;
  const exiting = exit !== undefined ? resolveExit(exit, transition) : undefined;

  return (
    <Animated.Text
      style={style}
      layout={layout ? LinearTransition : undefined}
      entering={entering}
      exiting={exiting}
    >
      {children}
    </Animated.Text>
  );
}