<script setup lang="ts">
import { ref } from "vue";

const isOpened = ref(false);

const togglePopover = () => {
  isOpened.value = !isOpened.value;
};
</script>

<template>
  <div class="relative">
    <slot :click="togglePopover"></slot>
    <div class="absolute left-full top-0 shadow-xl bg-bgMain p-2 rounded-md z-30" :class="isOpened ? '' : 'hidden'">{{ isOpened }}</div>
  </div>
</template>
