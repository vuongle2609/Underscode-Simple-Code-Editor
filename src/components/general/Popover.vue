<script setup lang="ts">
import { computed, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const { activeWithHover } = defineProps<{
  activeWithHover?: boolean;
}>();

const isOpened = ref(false);
const target = ref(null);

const togglePopover = () => {
  isOpened.value = !isOpened.value;
};

onClickOutside(target, () => {
  isOpened.value = false;
});

const dropDownClass = computed(() => [
  "absolute top-0 z-30 rounded-md shadow-md left-full bg-bgMain",
  isOpened.value ? "" : "hidden",
  activeWithHover ? "group-hover:block hidden" : "",
]);
</script>

<template>
  <div class="relative group w-full" ref="target">
    <slot :toggle="togglePopover" :isOpened :dropDownClass></slot>
  </div>
</template>
