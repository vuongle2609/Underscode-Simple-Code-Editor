<script setup lang="ts">
import { Tab, useTabOpen } from "@/stores/tabOpen";
import FileExplorer from "@/views/NavBar/FileExplorer";
import SearchTab from "@/views/NavBar/SearchTab";
import { computed, ref } from "vue";

const tabOpen = useTabOpen();

const width = ref(250);

const minWidthDinamic = computed(() => ({
  "min-width": width.value + "px",
}));

const handleChangeSize = ({ width: newWidth }: { width: number }) => {
  width.value = newWidth;
};
</script>

<template>
  <vue-resizable
    :style="minWidthDinamic"
    minWidth="250"
    :active="['r']"
    :width="width"
    @resize:start="handleChangeSize"
    @resize:move="handleChangeSize"
    @resize:end="handleChangeSize"
    class="!h-full"
  >
    <div class="min-w-full text-white bg-bgMain size-full">
      <FileExplorer v-if="tabOpen.openTab == Tab.explorer" />

      <SearchTab v-if="tabOpen.openTab == Tab.search" />

      <!-- <GitTab v-if="tabOpen.openTab == Tab.git" /> -->
    </div></vue-resizable
  >
</template>
