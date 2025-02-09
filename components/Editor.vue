<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { Storage } from '@plasmohq/storage';
import { ref, defineEmits, onUnmounted, computed } from 'vue';
import { defaultConfig } from '../config/default';
import { parse as yamlParse } from 'yaml';

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
const validationError = ref<string | null>(null);
let debounceTimer: number | null = null;
let storageCache: string | null = null;

const validateYaml = (content: string): boolean => {
  try {
    yamlParse(content);
    validationError.value = null;
    return true;
  } catch (error) {
    validationError.value = error.message;
    return false;
  }
};

// Load initial configuration with caching
const loadInitialConfig = async () => {
  try {
    storageCache = await storage.get('config');
    if (!storageCache) {
      const initialConfig = defaultConfig;
      if (validateYaml(initialConfig)) {
        code.value = initialConfig;
        // Save default config to storage
        await storage.set('config', initialConfig);
        storageCache = initialConfig;
      }
    } else {
      if (validateYaml(storageCache)) {
        code.value = storageCache;
      } else {
        // If stored config is invalid, fallback to default
        code.value = defaultConfig;
        validateYaml(defaultConfig);
      }
    }
  } catch (error) {
    console.error('Failed to load configuration:', error);
    code.value = defaultConfig;
    validateYaml(defaultConfig);
  }
};

// Initialize component
try {
  await Promise.all([
    loadCodeMirrorDeps(),
    loadInitialConfig()
  ]);
} catch (error) {
  console.error('Component initialization failed:', error);
}

// Debounced save function
const debouncedSave = async (newValue: string) => {
  const debounceDelay = 500;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Only update cache if YAML is valid
  if (validateYaml(newValue)) {
    storageCache = newValue;

    debounceTimer = window.setTimeout(async () => {
      try {
        const currentConfig = await storage.get('config');

        // Only save if the value has actually changed
        if (newValue !== currentConfig) {
          await storage.set('config', newValue);
          emit('configUpdated');
        }
      } catch (error) {
        console.error('Failed to save configuration:', error);
        // Invalidate cache on error and try to recover
        storageCache = null;
        code.value = newValue; // Keep the editor content
      }
    }, debounceDelay);
  }
};

// Clean up timer on component unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
});

const options = {
  mode: 'text/x-yaml',
  theme: 'dracula',
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: true,
  autofocus: true,
  viewportMargin: Infinity,
  extraKeys: {
    'Ctrl-S': (cm) => {
      if (cm.getValue) {
        const value = cm.getValue();
        debouncedSave(value);
      }
    }
  }
};
</script>

<template>
  <div class="editor-container">
    <Codemirror
      v-model:value="code"
      :options="options"
      border
      placeholder="Enter your YAML configuration here..."
      :height="800"
      @change="(content) => {
        validateYaml(content);
        debouncedSave(content);
      }"
    />
    <div v-if="validationError" class="validation-error">
      Invalid YAML: {{ validationError }}
    </div>
  </div>
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

  .editor-container {
    position: relative;
    width: 100%;
  }

  .validation-error {
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    padding: 12px 16px;
    background-color: #ff5555;
    color: white;
    font-size: 14px;
    z-index: 1000;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease;
  }
</style>
