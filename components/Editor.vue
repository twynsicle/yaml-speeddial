<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { Storage } from '@plasmohq/storage';
import { ref, defineEmits, onUnmounted } from 'vue';

// Lazy load CodeMirror component
const Codemirror = defineAsyncComponent({
  loader: () => import('codemirror-editor-vue3'),
  loadingTemplate: '<div>Loading editor...</div>',
  delay: 200,
  timeout: 3000
});

// Lazy load CodeMirror styles and modes
const loadCodeMirrorDeps = async () => {
  await Promise.all([
    import('codemirror/theme/dracula.css'),
    import('codemirror/mode/yaml/yaml.js'),
    import('codemirror/addon/display/placeholder.js')
  ]);
};

const emit = defineEmits(['configUpdated']);

const storage = new Storage({
  area: 'local',
});

const code = ref(null);
let debounceTimer: number | null = null;
let storageCache: string | null = null;

// Load initial configuration with caching
const loadInitialConfig = async () => {
  try {
    if (!storageCache) {
      storageCache = await storage.get('config');
      code.value = storageCache;
    } else {
      code.value = storageCache;
    }
  } catch (error) {
    console.error('Failed to load configuration:', error);
  }
};

// Initialize component
await Promise.all([
  loadCodeMirrorDeps(),
  loadInitialConfig()
]);

// Debounced save function
const debouncedSave = async (newValue: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Update cache immediately
  storageCache = newValue;

  debounceTimer = window.setTimeout(async () => {
    try {
      // Only save if the value has actually changed
      if (newValue !== await storage.get('config')) {
        await storage.set('config', newValue);
        emit('configUpdated');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      // Invalidate cache on error
      storageCache = null;
    }
  }, 1000); // Increased to 1000ms for better performance
};

// Clean up timer on component unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

const onChange = async (newValue: string) => {
  code.value = newValue;
  await debouncedSave(newValue);
};

const options = {
  mode: 'text/x-yaml',
  theme: 'dracula',
  tabSize: 2,
  lineNumbers: true,
};
</script>

<template>
  <Codemirror
    v-model:value="code"
    :options="options"
    border
    placeholder="Enter your YAML configuration here..."
    :height="800"
    @change="onChange"
  />
</template>

<style lang="scss">
/* Optimize CodeMirror performance */
.CodeMirror {
  contain: content; /* CSS containment for better performance */
  will-change: transform; /* Hardware acceleration hint */
  backface-visibility: hidden; /* Reduce composite layers */

  /* Optimize font rendering */
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  /* Reduce paint operations */
  .CodeMirror-scroll {
    will-change: transform;
    transform: translateZ(0);
    contain: paint layout;
  }

  /* Optimize cursor rendering */
  .CodeMirror-cursor {
    will-change: transform;
    transform: translateZ(0);
    contain: strict;
  }

  /* Optimize line rendering */
  .CodeMirror-line {
    contain: content;
  }

  /* Optimize gutter rendering */
  .CodeMirror-gutter {
    contain: strict;
  }
}
</style>
