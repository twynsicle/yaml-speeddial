<script setup lang="ts">
import { Storage } from '@plasmohq/storage';
import { parse } from 'yaml';
import { ref, onMounted, computed } from 'vue';
import Editor from './Editor.vue';
import ThemeToggle from './ThemeToggle.vue';
import IconButton from './IconButton.vue';
import { defaultConfig } from '../config/default';

// Initialize storage with proper configuration
const storage = new Storage({
  area: "local",
  allCopied: true
});

// Efficient Font Awesome loading with preconnect and async loading
const setupFontAwesome = () => {
  // Add preconnect for faster CDN connection
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://cdnjs.cloudflare.com';
  document.head.appendChild(preconnect);

  // Add DNS prefetch as fallback
  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = 'https://cdnjs.cloudflare.com';
  document.head.appendChild(dnsPrefetch);

  // Preload Font Awesome with high priority
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'style';
  preload.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  document.head.appendChild(preload);

  // Load Font Awesome stylesheet asynchronously
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  stylesheet.media = 'print';
  stylesheet.onload = () => {
    stylesheet.media = 'all';
  };
  document.head.appendChild(stylesheet);
};

const showSettings = ref(false);
const config = ref(null);
const parsedConfig = ref(null);
const configCache = new Map();

// Computed property for parsed configuration with caching
// Memoized YAML parsing with error handling and cache size limit
const MAX_CACHE_SIZE = 10;
const getParsedConfig = computed(() => {
  if (!config.value) return null;

  const cacheKey = config.value;
  if (configCache.has(cacheKey)) {
    return configCache.get(cacheKey);
  }

  try {
    const parsed = parse(cacheKey);

    // Implement LRU-like cache clearing
    if (configCache.size >= MAX_CACHE_SIZE) {
      const firstKey = configCache.keys().next().value;
      configCache.delete(firstKey);
    }

    configCache.set(cacheKey, parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to parse YAML:', error);
    return null;
  }
});

onMounted(async () => {
  // Setup Font Awesome loading
  setupFontAwesome();

  // Load initial configuration
  await handleConfigUpdate();
});

const toggleSettings = () => {
  showSettings.value = !showSettings.value;

  if (showSettings.value === false) {
    handleConfigUpdate();
  }
};

const handleConfigUpdate = async () => {
  const newConfig = await storage.get('config');
  if (!newConfig) {
    // Use default config if none exists
    config.value = defaultConfig;
    await storage.set('config', defaultConfig);
  } else if (newConfig !== config.value) {
    config.value = newConfig;
  }
  parsedConfig.value = getParsedConfig.value;
};
</script>

<template>
  <div class="speeddial">
    <ThemeToggle />
    <IconButton 
      icon="fa-cog"
      title="Settings"
      :right="20"
      @click="toggleSettings"
    />

    <div class="group" v-for="group in parsedConfig?.groups" :key="group.name">
      <section v-if="group.subgroups != null">
        <h2 v-if="group.url != null">
          <a :href="group.url">{{ group.name }}</a>
        </h2>
        <h2 v-else>{{ group.name }}</h2>
        <div class="subgroup" v-for="subgroup in group.subgroups">
          <h3 v-if="subgroup.url != null">
            <a :href="subgroup.url">{{ subgroup.name }}</a>
          </h3>
          <h3 v-else>{{ subgroup.name }}</h3>
          <div class="sites">
            <div class="site" v-for="site in subgroup.sites">
              <a class="link" :href="site.url">{{ site.name }}</a>
            </div>
          </div>
        </div>
      </section>
      <section v-else class="direct-children">
        <h2 v-if="group.url != null">
          <a :href="group.url">{{ group.name }}</a>
        </h2>
        <h2 v-else>{{ group.name }}</h2>
        <div class="sites">
          <div class="site" v-for="site in group.sites">
            <a class="link" :href="site.url">{{ site.name }}</a>
          </div>
        </div>
      </section>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="modal-overlay" @click="toggleSettings"></div>
    <div v-if="showSettings" class="modal-content">
      <Editor @config-updated="handleConfigUpdate" />
      <div class="button-container">
        <button class="save-button" @click="toggleSettings">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.speeddial {
  padding: 150px 10% 0 10%;
  margin-left: 20%;
  background: transparent;


  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .modal-content {
    background: var(--modal-content-bg);
    padding: 20px;
    border-radius: 8px;
    width: 70vw;
    max-height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    z-index: 1000;
    border: 2px solid var(--button-color);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0;
    box-sizing: border-box;
  }


  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .save-button {
    background: var(--button-bg);
    color: var(--button-text);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Raleway', sans-serif;
    min-width: 100px;

    &:hover {
      background: var(--button-bg-hover);
    }
  }

  h2,
  h3 {
    font-family: 'Montserrat', sans-serif;
    color: var(--heading-color);
    a {
      color: var(--heading-color);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  button {
    font-family: 'Raleway', sans-serif;
  }

  section {
    margin: 20px 0;
  }

  .group {
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: 30px;
    margin: 0 0;
    border: none;
  }

  .subgroup {
    display: flex;
    flex-direction: row;
    align-items: center;

    h3 {
      width: 200px;
      min-width: 200px;
      font-size: 20px;
      margin: 5px 0;
      padding-right: 15px;
      flex-shrink: 0;
    }

    .sites {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: calc(100% - 200px); /* Subtract the width of h3 to ensure proper alignment */

      .link {
        color: var(--site-color);
        font-size: 20px;
        padding: 0 10px;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .subgroup:not(:first-child) {
    margin-top: 8px;
  }

  .subgroup:not(:last-child) {
    margin-bottom:8px;
  }

  .direct-children {
    align-items: center;

    h2 {
      width: 200px;
      min-width: 200px;
      padding-right: 15px;
      flex-shrink: 0;
      margin: 5px 0;
    }

    display: flex;
    flex-direction: row;
  }

  .sites {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: calc(100% - 200px); /* Subtract the width of h3 to ensure proper alignment */


    .link {
      color: var(--site-color);
      font-size: 20px;
      padding: 0 10px;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
