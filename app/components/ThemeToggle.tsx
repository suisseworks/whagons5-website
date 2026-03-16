'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'magic';

const THEMES: Theme[] = ['light', 'dark', 'magic'];

interface ThemeToggleProps {
  onThemeChange?: (theme: Theme) => void;
}

/* ── SVG Icons ──────────────────────────────── */

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8" y1="0.8" x2="8" y2="2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8" y1="13.2" x2="8" y2="15.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15.2" y1="8" x2="13.2" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="2.8" y1="8" x2="0.8" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13.09" y1="2.91" x2="11.68" y2="4.32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="4.32" y1="11.68" x2="2.91" y2="13.09" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13.09" y1="13.09" x2="11.68" y2="11.68" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="4.32" y1="4.32" x2="2.91" y2="2.91" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main 4-point star */}
      <path
        d="M8 1L9.4 6.6L15 8L9.4 9.4L8 15L6.6 9.4L1 8L6.6 6.6L8 1Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Small accent star top-right */}
      <path
        d="M13 1.5L13.5 3L15 3.5L13.5 4L13 5.5L12.5 4L11 3.5L12.5 3L13 1.5Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
    </svg>
  );
}

/* ── Component ──────────────────────────────── */

export default function ThemeToggle({ onThemeChange }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('whagons-theme') as Theme | null;
    const initial = stored && THEMES.includes(stored) ? stored : 'light';
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    setMounted(true);
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => {
      const idx = THEMES.indexOf(prev);
      const next = THEMES[(idx + 1) % THEMES.length];
      document.documentElement.dataset.theme = next;
      localStorage.setItem('whagons-theme', next);
      onThemeChange?.(next);
      return next;
    });
  }, [onThemeChange]);

  // Prevent flash of wrong icon during SSR
  if (!mounted) {
    return (
      <button className="theme-btn" aria-label="Toggle theme" disabled>
        <SunIcon />
      </button>
    );
  }

  const labels: Record<Theme, string> = {
    light: 'Light mode',
    dark: 'Dark mode',
    magic: 'Magic mode',
  };

  return (
    <button
      className="theme-btn"
      onClick={cycleTheme}
      aria-label={`${labels[theme]} — click to switch`}
      title={labels[theme]}
    >
      {theme === 'light' && <SunIcon />}
      {theme === 'dark' && <MoonIcon />}
      {theme === 'magic' && <SparkleIcon />}
    </button>
  );
}
