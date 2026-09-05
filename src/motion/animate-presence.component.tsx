import React from 'react';
import Animated from 'react-native-reanimated';

import { resolveEnter, resolveExit } from './motion.preset';
import type { IMotionBaseProps, IMotionViewStyle } from './motion.type';

/**
 * Framer Motion `AnimatePresence` for React Native, built on Reanimated 4.
 *
 * When `visible` becomes `true` the child is mounted (or re-mounted) and the
 * `enter` builder plays. When it flips to `false` the child is unmounted and
 * Reanimated automatically defers the physical removal so the `exit` builder
 * can play out — exactly like Framer's `exit`.
 *
 *   <AnimatePresence
 *     visible={open}
 *     enter="fade-up"
 *     exit="fade"
 *     transition={{ duration: 'gentle' }}
 *   >
 *     <Card>…</Card>
 *   </AnimatePresence>
 */
export interface IAnimatePresenceProps extends IMotionBaseProps {
  /** Whether the child should currently be part of the tree. */
  visible: boolean;
  children: React.ReactNode;
  style?: IMotionViewStyle | IMotionViewStyle[];
}

export function AnimatePresence({
  visible,
  children,
  style,
  enter,
  exit,
  transition,
}: IAnimatePresenceProps): JSX.Element | null {
  if (!visible) {
    return null;
  }

  const entering =
    enter !== undefined ? resolveEnter(enter, transition) : undefined;
  const exiting = exit !== undefined ? resolveExit(exit, transition) : undefined;

  return (
    <Animated.View style={style} entering={entering} exiting={exiting}>
      {children}
    </Animated.View>
  );
}