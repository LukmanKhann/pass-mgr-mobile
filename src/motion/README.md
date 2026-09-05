# Motion / UI · UX Animation Skill

Framer Motion–style animation primitives for this React Native app, powered by
[**React Native Reanimated 4**](https://docs.swmansion.com/react-native-reanimated/)
(Software Mansion — maintained by core React Native contributors) and the
**Worklets** UI-thread runtime.

> Framer Motion / `motion` itself is a **web-only** library (requires `react-dom`)
> and **cannot** run inside React Native. Reanimated 4 is the platform's native,
> UI-thread equivalent and exposes the same declarative concept (enter/exit,
> springs, layout) that this skill maps onto a familiar API.

## Quick start

```tsx
import { MotionView, AnimatePresence, Skeleton } from '@motion';
```

### Entrance animation

```tsx
<MotionView enter="fade-up" transition={{ spring: 'snappy', delay: 120 }}>
  <Card padding="xl">…</Card>
</MotionView>
```

### Mount / unmount presence (Framer `AnimatePresence` / `exit`)

```tsx
<AnimatePresence
  visible={open}
  enter="slide-up"
  exit="fade"
  transition={{ duration: 'gentle' }}
>
  <Card>…</Card>
</AnimatePresence>
```

> On unmount, Reanimated 4 defers the physical removal so the `exit` animation
> plays out. Wrap animated siblings in `MotionView`/`Animated.View` if you need
> them to co-exit.

### Layout animation (move / reorder / resize)

```tsx
<MotionView layout enter="fade">
  <AnimatedItems /> {/* children animate between positions */}
</MotionView>
```

### Loading skeletons

```tsx
<Skeleton variant="card" />
<Skeleton variant="text" style={{ width: '80%' }} />
```

## Tokens

- `motionDurations` — `quick(120)` `fast(200)` `normal(280)` `gentle(420)` `slow(600)`
- `motionSpringDamping` — `gentle(1)` `snappy(0.92)` `wiggly(0.6)`
- `motionEasings` — `linear` `ease-out` `ease-in` `ease-in-out` `back-out`
- `motionDurationOf(transition)` — effective ms (duration + delay)

## Entrance presets

`fade`, `fade-up/down/left/right`, `slide-up/down/left/right`, `zoom-in`,
`zoom-out`, `bounce`, `flip-x`, `flip-y`.

## Exit presets

`fade`, `slide-up/down/left/right`, `zoom-out`.

## Transition descriptor (`IMotionTransition`)

```ts
{
  type: 'timing' | 'spring',       // default: 'timing'
  spring: 'snappy' | 'gentle' | 'wiggly',
  duration: 'quick' | 'fast' | 'normal' | 'gentle' | 'slow' | number,
  easing: 'linear' | 'ease-out' | 'ease-in' | 'ease-in-out' | 'back-out',
  delay: number,                   // ms
}
```

## Advanced

Pass a Reanimated builder directly (`enter`, `exit`, `layout` props):

```tsx
import { FadeInUp, SnappySpringConfig } from 'react-native-reanimated';

<MotionView enter={FadeInUp.duration(300).delay(80)} layout>
  …
</MotionView>
```

All tokens and presets extend the value set in the package root exports
(`react-native-reanimated`).

## Requires

- `react-native-reanimated@^4.6.0`
- `react-native-worklets@^0.12.0` (+ `react-native-worklets/plugin` in
  `babel.config.js`, already configured)
- Project uses the React Native **New Architecture** (`newArchEnabled=true`),
  which Reanimated 4 requires.
- iOS: `cd ios && pod install && pod update` (see project root instructions).