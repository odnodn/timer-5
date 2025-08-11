export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `0:${seconds.toString().padStart(2, '0')}`;
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleString();
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString();
}