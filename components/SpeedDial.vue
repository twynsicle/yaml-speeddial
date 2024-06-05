<script setup lang="ts">
import { Storage } from '@plasmohq/storage';

import { parse } from 'yaml';

const storage = new Storage({
  area: 'local',
});

// storage.set('config', 'value');

const config = await storage.get('config');

const parsedConfig = await parse(config);

console.log(config);
</script>

<template>
  <div class="speeddial">
    <div class="group" v-for="group in parsedConfig.groups">
      <section v-if="group.subgroups != null">
        <h2>{{ group.name }}</h2>
        <div class="subgroup" v-for="subgroup in group.subgroups">
          <h3>{{ subgroup.name }}</h3>
          <div class="site" v-for="site in subgroup.sites">
            <button :href="site.url">{{ site.name }}</button>
          </div>
        </div>
      </section>
      <section v-else class="direct-children">
        <h2>{{ group.name }}</h2>
        <div class="site" v-for="site in group.sites">
          <button :href="site.url">{{ site.name }}</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
h2,
h3 {
  font-family: 'Montserrat', sans-serif;
}

button {
  font-family: 'Raleway', sans-serif;
}

section {
  margin: 20px 0;
}

.speeddial {
  margin: 100px 10% 0 10%;
}

.group {
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: 30px;
  margin: 10px 0;
}

.subgroup {
  display: flex;
  flex-direction: row;
  align-items: center;
}

h3 {
  width: 200px;
  font-size: 20px;
  margin: 5px 0;
}

button {
  font-size: 20px;
  padding: 0 10px;
  background: none;
  border: none;
  margin: 0;
  cursor: pointer;
  outline: inherit;
  &:hover {
    text-decoration: underline;
  }
}

.direct-children {
  h2 {
    width: 200px;
  }
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
