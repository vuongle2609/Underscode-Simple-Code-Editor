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

const closePopover = () => {
  isOpened.value = false;
};

onClickOutside(target, () => {
  isOpened.value = false;
});

const dropDownClass = computed(() => [
  "absolute top-0 z-30 rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] left-full bg-bgMain",
  isOpened.value ? "" : "hidden",
  activeWithHover ? "group-hover:block hidden" : "",
]);
</script>

<template>
  <div
    class="relative w-full"
    :class="activeWithHover ? 'group' : ''"
    ref="target"
  >
    <slot
      :toggle="togglePopover"
      :close="closePopover"
      :isOpened
      :dropDownClass
    ></slot>
  </div>
</template>
