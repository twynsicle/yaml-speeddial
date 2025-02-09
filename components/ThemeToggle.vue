<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Storage } from '@plasmohq/storage';
import IconButton from './IconButton.vue';

const storage = new Storage({ area: 'local' });
const currentTheme = ref('system');

// Initialize theme
onMounted(async () => {
  const savedTheme = await storage.get('theme');
  if (savedTheme) {
    currentTheme.value = savedTheme;
  } else {
    currentTheme.value = 'dark';
  }

    document.documentElement.setAttribute('data-theme', currentTheme.value);
});

// Toggle theme
const toggleTheme = async () => {
  const themes = ['light', 'dark'];
  const currentIndex = themes.indexOf(currentTheme.value);
  const nextIndex = (currentIndex + 1) % themes.length;
  currentTheme.value = themes[nextIndex];

  await storage.set('theme', currentTheme.value);

  document.documentElement.setAttribute('data-theme', currentTheme.value);
};

// Compute the current icon based on theme
const themeIcon = computed(() => 
  currentTheme.value === 'light' ? 'fa-sun' : 'fa-moon'
);
</script>

<template>
  <IconButton
    :icon="themeIcon"
    :title="'Theme: ' + currentTheme"
    :right="60"
    @click="toggleTheme"
  />
</template>
