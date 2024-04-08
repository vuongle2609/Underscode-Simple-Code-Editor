<script setup lang="ts">
import { Tab, useTabOpen } from "@/stores/tabOpen";
import FileExplorer from "@/views/NavBar/FileExplorer";
import SearchTab from "@/views/NavBar/SearchTab";
import GitTab from "@/views/NavBar/GitTab";

const tabOpen = useTabOpen();
</script>

<template>
  <vue-resizable minWidth="250" :active="['r']" :width="300">
    <div class="text-white bg-bgMain size-full">
      <FileExplorer v-if="tabOpen.openTab == Tab.explorer" />

      <SearchTab v-if="tabOpen.openTab == Tab.search" />

      <!-- <GitTab v-if="tabOpen.openTab == Tab.git" /> -->
    </div></vue-resizable
  >
</template>
