import type { ViewStyle, TextStyle } from 'react-native';
import type { BaseAnimationBuilder } from 'react-native-reanimated';

/**
 * Entrance presets modelled after Framer Motion's `initial`/`animate` values.
 * Each maps onto a React Native Reanimated entering animation builder.
 */
export type MotionEnterPreset =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'bounce'
  | 'flip-x'
  | 'flip-y';

/**
 * Exit presets modelled after Framer Motion's `exit` values.
 */
export type MotionExitPreset =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-out';

/** Named spring configurations (Framer `type: 'spring'` equivalent). */
export type MotionSpring = 'snappy' | 'gentle' | 'wiggly';

/** Named easings (Framer `ease` values). */
export type MotionEasing =
  | 'linear'
  | 'ease-out'
  | 'ease-in'
  | 'ease-in-out'
  | 'back-out';

/** Named durations aligned to the Material motion system. */
export type MotionDuration =
  | 'quick'
  | 'fast'
  | 'normal'
  | 'gentle'
  | 'slow';

/**
 * Framer Motion-like transition descriptor translated into a Reanimated
 * animation builder.
 */
export interface IMotionTransition {
  /** `timing` (eased tween) or `spring` (physics). Defaults to `timing`. */
  type?: 'timing' | 'spring';
  /** Named spring preset, used when `type` is `spring`. */
  spring?: MotionSpring;
  /** Named or literal duration in milliseconds. */
  duration?: MotionDuration | number;
  /** Named easing, used when `type` is `timing`. */
  easing?: MotionEasing;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
}

/**
 * A resolved Reanimated animation builder (either the builder class itself or
 * an instance produced by chaining `.duration()`, `.delay()`, `.springify()`).
 */
export type MotionBuilder = BaseAnimationBuilder | typeof BaseAnimationBuilder;

/** Props shared by every motion-aware layout/control wrapper. */
export interface IMotionBaseProps {
  enter?: MotionEnterPreset | MotionBuilder;
  exit?: MotionExitPreset | MotionBuilder;
  transition?: IMotionTransition;
}

/** Style type reused for motion-aware View wrappers. */
export type IMotionViewStyle = ViewStyle;
export type IMotionTextStyle = TextStyle;