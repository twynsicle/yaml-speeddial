<script setup lang="ts">
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/addon/display/placeholder.js';
import { Storage } from '@plasmohq/storage';
import { ref } from 'vue';

const storage = new Storage({
  area: 'local',
});

const code = ref(null);

const loadedCode = await storage.get('config');

if (loadedCode) {
  code.value = loadedCode;
}

const onChange = (newValue: string) => {
  storage.set('config', newValue);
  console.log('updating config');
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
    placeholder="test placeholder"
    :height="1000"
    @change="onChange"
  />
</template>

<style scoped lang="scss"></style>
