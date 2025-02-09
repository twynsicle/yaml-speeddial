<script setup lang="ts">
import { Storage } from '@plasmohq/storage';
import { parse } from 'yaml';
import { ref, onMounted } from 'vue';
import Editor from './Editor.vue';
import ThemeToggle from './ThemeToggle.vue';

// Add Font Awesome
const loadFontAwesome = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  document.head.appendChild(link);
};

onMounted(() => {
  loadFontAwesome();
});

const storage = new Storage({
  area: 'local',
});

const showSettings = ref(false);
const config = ref(null);
const parsedConfig = ref(null);

onMounted(async () => {
  await handleConfigUpdate();
});

const toggleSettings = () => {
  showSettings.value = !showSettings.value;

  if (showSettings.value === false) {
    handleConfigUpdate();
  }
};

const handleConfigUpdate = async () => {
  console.log('config update')
  config.value = await storage.get('config');
  try {
    parsedConfig.value = config.value != null ? await parse(config.value) : null;
  } catch {
    parsedConfig.value = null;
  }

  console.log(parsedConfig.value)
};
</script>

<template>
  <div class="speeddial">
    <ThemeToggle />
    <button class="settings-button" @click="toggleSettings" title="Settings">
      <i class="fas fa-cog"></i>
    </button>

    <div class="group" v-for="group in parsedConfig.groups" v-if="parsedConfig != null && parsedConfig.groups != null">
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
    <div v-if="showSettings" class="modal-overlay" @click="toggleSettings">
      <div class="modal-content" @click.stop>
        <Editor @config-updated="handleConfigUpdate" />
        <div class="button-container">
          <button class="save-button" @click="toggleSettings">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.speeddial {
  width: 100%;
  padding: 150px 10% 0 10%;
  position: relative;
  background: transparent;

  .settings-button {
    position: fixed;
    top: 20px;
    right: 20px;
    background: transparent;
    border: none;
    color: var(--button-color);
    font-size: 24px;
    cursor: pointer;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--modal-overlay-bg);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--modal-content-bg);
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 1200px;
    //min-height: 80vh;
    //max-height: 80vh;
    overflow-y: visible;
    position: relative;
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

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
