export const DEFAULT_AUTO_LOCK_MINUTES = 5;
export const AUTO_LOCK_NEVER_MINUTES = -1;

export interface IAutoLockOption {
  minutes: number;
  label: string;
  description: string;
}

export const AUTO_LOCK_OPTIONS: IAutoLockOption[] = [
  {
    minutes: 0,
    label: 'Immediately',
    description: 'Lock as soon as the app goes to the background',
  },
  {
    minutes: 1,
    label: 'After 1 minute',
    description: 'Lock after 1 minute in the background',
  },
  {
    minutes: 2,
    label: 'After 2 minutes',
    description: 'Lock after 2 minutes in the background',
  },
  {
    minutes: 5,
    label: 'After 5 minutes',
    description: 'Lock after 5 minutes in the background',
  },
  {
    minutes: 10,
    label: 'After 10 minutes',
    description: 'Lock after 10 minutes in the background',
  },
  {
    minutes: AUTO_LOCK_NEVER_MINUTES,
    label: 'Never',
    description: 'Never lock the app automatically',
  },
];

export function isValidAutoLockMinutes(minutes: number): boolean {
  return AUTO_LOCK_OPTIONS.some(option => option.minutes === minutes);
}

export function formatAutoLockSubtitle(minutes: number): string {
  if (minutes === AUTO_LOCK_NEVER_MINUTES) {
    return 'Does not lock automatically';
  }
  if (minutes === 0) {
    return 'Locks immediately when the app is backgrounded';
  }
  const unit = minutes === 1 ? 'minute' : 'minutes';
  return `Locks after ${minutes} ${unit} in the background`;
}
