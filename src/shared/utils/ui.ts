import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clipboard(value) {
  if (typeof document === 'undefined') return;
  const textarea = document.createElement('textarea');
  if (['object', 'symbol', 'function', 'undefined'].includes(typeof value)) {
    value = JSON.stringify(value);
  }
  textarea.textContent = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
