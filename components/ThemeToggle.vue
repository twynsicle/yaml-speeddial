<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Storage } from '@plasmohq/storage';

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
</script>

<template>
  <button class="theme-toggle" @click="toggleTheme" :title="'Theme: ' + currentTheme">
    <i class="fas" :class="{
      'fa-sun': currentTheme === 'light',
      'fa-moon': currentTheme === 'dark'
    }"></i>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 60px;
  background: transparent;
  border: none;
  color: var(--button-color);
  font-size: 24px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
    background: transparent;
    color: var(--button-color);
  }
}
</style>
