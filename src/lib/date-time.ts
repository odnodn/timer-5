export type Milliseconds = number;

export type DurationFn = (now: Milliseconds) => number;

export const millisecondsToSeconds = (ms: Milliseconds): number => ms / 1000;
export const secondsToMilliseconds = (s: number): Milliseconds => s * 1000;