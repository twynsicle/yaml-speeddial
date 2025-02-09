<script setup lang="ts">
defineProps<{
  icon: string;     // Font Awesome icon class (e.g., 'fa-cog')
  title?: string;   // Button tooltip
  right?: number;   // Right position in pixels
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button 
    class="icon-button" 
    :title="title" 
    :style="{ right: right ? `${right}px` : '20px' }"
    @click="$emit('click')"
  >
    <i class="fas" :class="icon"></i>
  </button>
</template>

<style scoped lang="scss">
.icon-button {
  position: absolute;
  top: 20px;
  background: transparent;
  border: none;
  color: var(--button-color);
  font-size: 24px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
}
</style>
