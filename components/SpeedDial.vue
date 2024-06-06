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
        <h2 v-if="group.url != null">
          <a :href="group.url">{{ group.name }}</a>
        </h2>
        <h2 v-else>{{ group.name }}</h2>
        <div class="subgroup" v-for="subgroup in group.subgroups">
          <h3 v-if="subgroup.url != null">
            <a :href="subgroup.url">{{ subgroup.name }}</a>
          </h3>
          <h3 v-else>{{ subgroup.name }}</h3>
          <div class="site" v-for="site in subgroup.sites">
            <a class="link" :href="site.url">{{ site.name }}</a>
          </div>
        </div>
      </section>
      <section v-else class="direct-children">
        <h2 v-if="group.url != null">
          <a :href="group.url">{{ group.name }}</a>
        </h2>
        <h2 v-else>{{ group.name }}</h2>
        <div class="site" v-for="site in group.sites">
          <a class="link" :href="site.url">{{ site.name }}</a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.speeddial {
  margin: 150px 10% 0 10%;

  h2,
  h3 {
    font-family: 'Montserrat', sans-serif;
    color: #b6b6b6;
    a {
      color: #b6b6b6;
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
    margin: 10px 0;
    border: none;
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

  .link {
    font-size: 20px;
    padding: 0 10px;
    color: #999;
  }

  .direct-children {
    h2 {
      width: 200px;
    }

    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
