<script setup lang="ts">
import { Tab, useTabOpen } from "@/stores/tabOpen";
import FileExplorer from "@/views/NavBar/FileExplorer";
import SearchTab from "@/views/NavBar/SearchTab";
import { computed, ref } from "vue";

const tabOpen = useTabOpen();

const width = ref(300);

const test = computed(() => ({
  "min-width": width.value + "px",
}));

const hanleChangeSize = ({ width: newWidth }: { width: number }) => {
  width.value = newWidth;
};
</script>

<template>
  <vue-resizable
    :style="test"
    minWidth="250"
    :active="['r']"
    :width
    @resize:start="hanleChangeSize"
    @resize:move="hanleChangeSize"
    @resize:end="hanleChangeSize"
  >
    <div class="min-w-full text-white bg-bgMain size-full">
      <FileExplorer v-if="tabOpen.openTab == Tab.explorer" />

      <SearchTab v-if="tabOpen.openTab == Tab.search" />

      <!-- <GitTab v-if="tabOpen.openTab == Tab.git" /> -->
    </div></vue-resizable
  >
</template>
