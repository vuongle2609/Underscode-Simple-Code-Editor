<script setup lang="ts">
import FileExplorer from "@/views/FileExplorer.vue";
import { Tab, useTabOpen } from "@/stores/tabOpen";
import SearchTab from "@/views/SearchTab";
import GitTab from "@/views/GitTab.vue";

const tabOpen = useTabOpen();
</script>

<template>
  <div class="text-white bg-bgMain min-w-[300px] max-w-[300px]">
    <FileExplorer v-if="tabOpen.openTab == Tab.explorer" />

    <SearchTab v-if="tabOpen.openTab == Tab.search" />

    <GitTab v-if="tabOpen.openTab == Tab.git" />
  </div>
</template>
