<script setup lang="ts">
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/addon/display/placeholder.js';
import { Storage } from '@plasmohq/storage';
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['configUpdated']);

const storage = new Storage({
  area: 'local',
});

const code = ref(null);

const loadedCode = await storage.get('config');

if (loadedCode) {
  code.value = loadedCode;
}

const onChange = async (newValue: string) => {
  await storage.set('config', newValue);
  emit('configUpdated');
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
.CodeMirror * {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
}
</style>
