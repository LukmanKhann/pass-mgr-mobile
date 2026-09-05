import {
  BaseAnimationBuilder,
  BounceIn,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FlipInEasyX,
  FlipInEasyY,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

import type {
  IMotionTransition,
  MotionBuilder,
  MotionDuration,
  MotionEasing,
  MotionEnterPreset,
  MotionExitPreset,
  MotionSpring,
} from './motion.type';
import type { EasingFunction } from 'react-native-reanimated';

/**
 * Motion design tokens — durations follow the Material Design motion system
 * and pair with the project's spacing/typography tokens.
 */
export const motionDurations: Record<MotionDuration, number> = {
  quick: 120,
  fast: 200,
  normal: 280,
  gentle: 420,
  slow: 600,
};

/** Default duration used when a transition omits one. */
export const motionDefaultDuration = motionDurations.normal;

/**
 * Damping ratios behind the named spring presets. Values are what Framer
 * Motion calls `type: 'spring'`-ready: `1` is critically damped (no bounce),
 * values below `1` add visible overshoot.
 */
export const motionSpringDamping: Record<MotionSpring, number> = {
  gentle: 1,
  snappy: 0.92,
  wiggly: 0.6,
};

/** Named easing curves. */
export const motionEasings: Record<MotionEasing, EasingFunction> = {
  linear: Easing.linear,
  'ease-out': Easing.out(Easing.cubic),
  'ease-in': Easing.in(Easing.cubic),
  'ease-in-out': Easing.inOut(Easing.cubic),
  'back-out': Easing.out(Easing.back(1.7)),
};

const enterPresets: Record<MotionEnterPreset, typeof BaseAnimationBuilder> = {
  fade: FadeIn,
  'fade-up': FadeInUp,
  'fade-down': FadeInDown,
  'fade-left': FadeInLeft,
  'fade-right': FadeInRight,
  'slide-up': SlideInUp,
  'slide-down': SlideInDown,
  'slide-left': SlideInLeft,
  'slide-right': SlideInRight,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
  bounce: BounceIn,
  'flip-x': FlipInEasyX,
  'flip-y': FlipInEasyY,
};

const exitPresets: Record<MotionExitPreset, typeof BaseAnimationBuilder> = {
  fade: FadeOut,
  'slide-up': SlideOutUp,
  'slide-down': SlideOutDown,
  'slide-left': SlideOutLeft,
  'slide-right': SlideOutRight,
  'zoom-out': ZoomOut,
};

function resolveDuration(duration: IMotionTransition['duration']): number {
  if (duration === undefined) {
    return motionDefaultDuration;
  }
  return typeof duration === 'number' ? duration : motionDurations[duration];
}

/**
 * Applies a Framer Motion-style transition descriptor onto a Reanimated
 * animation builder class. Chaining is safe in any order; builders return
 * frozen instances that the `entering`/`exiting` props accept directly.
 */
function applyTransition(
  builder: typeof BaseAnimationBuilder,
  transition?: IMotionTransition,
): MotionBuilder {
  let result: any = builder;

  if (transition) {
    const delay = transition.delay;
    const duration = resolveDuration(transition.duration);

    if (transition.type === 'spring') {
      result = result.springify(duration);
      if (transition.spring !== undefined) {
        result = result.dampingRatio(motionSpringDamping[transition.spring]);
      }
    } else {
      result = result.duration(duration);
      if (transition.easing !== undefined) {
        result = result.easing(motionEasings[transition.easing]);
      }
    }

    if (delay) {
      result = result.delay(delay);
    }
  }

  return result as MotionBuilder;
}

/** Resolve an entrance preset (plus optional transition) into a builder. */
export function resolveEnterPreset(
  preset: MotionEnterPreset,
  transition?: IMotionTransition,
): MotionBuilder {
  return applyTransition(enterPresets[preset], transition);
}

/** Resolve an exit preset (plus optional transition) into a builder. */
export function resolveExitPreset(
  preset: MotionExitPreset,
  transition?: IMotionTransition,
): MotionBuilder {
  return applyTransition(exitPresets[preset], transition);
}

/** Resolve either a preset string or an explicit builder to a builder. */
export function resolveEnter(
  enter: MotionEnterPreset | MotionBuilder,
  transition?: IMotionTransition,
): MotionBuilder {
  return typeof enter === 'string'
    ? resolveEnterPreset(enter, transition)
    : enter;
}

/** Resolve either a preset string or an explicit builder to a builder. */
export function resolveExit(
  exit: MotionExitPreset | MotionBuilder,
  transition?: IMotionTransition,
): MotionBuilder {
  return typeof exit === 'string'
    ? resolveExitPreset(exit, transition)
    : exit;
}

/** Effective duration (ms) of an animated sequence given a transition. */
export function motionDurationOf(transition?: IMotionTransition): number {
  return resolveDuration(transition?.duration) + (transition?.delay ?? 0);
}