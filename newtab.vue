<script setup lang="ts">
import { onMounted } from 'vue';
import { Storage } from '@plasmohq/storage';
import SpeedDial from './components/SpeedDial.vue';

// Initialize theme on app load
onMounted(async () => {
  const storage = new Storage({ area: 'local' });
  const savedTheme = await storage.get('theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
});
</script>

<template>
  <Suspense>
    <SpeedDial />
  </Suspense>
</template>

<style lang="scss">
:root {
  --bg-color: #1a1a1a;
  --heading-color: #b6b6b6;
  --site-color: #999999;
  --modal-overlay-bg: rgba(0, 0, 0, 0.7);
  --modal-content-bg: #2a2a2a;
  --button-color: #666666;
  --button-bg: #333333;
  --button-bg-hover: #444444;
  --button-text: #ffffff;
}

html {
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

  &[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --heading-color: #b6b6b6;
    --site-color: #999999;
    --modal-overlay-bg: rgba(0, 0, 0, 0.7);
    --modal-content-bg: #2a2a2a;
    --button-color: #666666;
    --button-bg: #333333;
    --button-bg-hover: #444444;
    --button-text: #ffffff;
  }
}

html {
  height: 100%;
  background: var(--bg-color);
}

body {
  height: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: transparent !important;
  color: var(--heading-color);
}

</style>
