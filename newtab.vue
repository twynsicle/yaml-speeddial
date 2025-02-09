<script setup lang="ts">
import { onMounted, defineAsyncComponent } from 'vue';
import { Storage } from '@plasmohq/storage';

// Lazy load SpeedDial component
const SpeedDial = defineAsyncComponent({
  loader: () => import('./components/SpeedDial.vue'),
  delay: 200,
  timeout: 3000
});

// Cache storage instance
const storage = new Storage({ area: 'local' });
let themeCache: string | null = null;

// Initialize theme with optimized handling
const initializeTheme = async () => {
  try {
    // Use cached theme if available
    if (!themeCache) {
      themeCache = await storage.get('theme');
    }

    if (themeCache) {
      document.documentElement.setAttribute('data-theme', themeCache);
      return;
    }

    // Check system preference with event listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      themeCache = theme;
      storage.set('theme', theme);
    };

    // Set initial theme
    handleThemeChange(mediaQuery);

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleThemeChange);
  } catch (error) {
    console.error('Failed to initialize theme:', error);
    // Fallback to light theme
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

onMounted(initializeTheme);
</script>

<template>
  <Suspense>
    <SpeedDial />
  </Suspense>
</template>

<style lang="scss">
/* Define theme variables with performance optimizations */
:root {
  /* Base theme (dark) */
  --bg-color: #1a1a1a;
  --heading-color: #b6b6b6;
  --site-color: #999999;
  --modal-overlay-bg: rgba(0, 0, 0, 0.7);
  --modal-content-bg: #2a2a2a;
  --button-color: #666666;
  --button-bg: #333333;
  --button-bg-hover: #444444;
  --button-text: #ffffff;

  /* Hardware acceleration for transitions */
  --transform-gpu: translateZ(0);

  /* Optimize paint operations */
  --paint-containment: content;
}

/* Theme-specific styles with containment */
html {
  will-change: background-color;
  transition: background-color 0.3s ease;

  &[data-theme="light"] {
    --bg-color: #ffffff;
    --heading-color: #2c3e50;
    --site-color: #3498db;
    --modal-overlay-bg: rgba(0, 0, 0, 0.5);
    --modal-content-bg: #ffffff;
    --button-color: #3498db;
    --button-bg: #3498db;
    --button-bg-hover: #2980b9;
    --button-text: #ffffff;
  }

  /* Dark theme inherits from :root */
  &[data-theme="dark"] {
    color-scheme: dark;
  }
}

/* Optimize layout performance */
html {
  height: 100%;
  background: var(--bg-color);
  text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: var(--transform-gpu);
}

body {
  height: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: transparent !important;
  color: var(--heading-color);
  transform: var(--transform-gpu);

  /* Optimize paint and layout operations */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

</style>
