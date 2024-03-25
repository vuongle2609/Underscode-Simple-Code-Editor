<script setup lang="ts">
import { computed, ref } from "vue";

const isOpened = ref(false);

const togglePopover = () => {
  isOpened.value = !isOpened.value;
};

const dropDownClass = computed(() => [
  "absolute top-0 z-30 rounded-md shadow-md left-full bg-bgMain",
  isOpened.value ? "" : "hidden",
]);
</script>

<template>
  <div class="relative">
    <slot :toggle="togglePopover" :isOpened :dropDownClass></slot>
  </div>
</template>
