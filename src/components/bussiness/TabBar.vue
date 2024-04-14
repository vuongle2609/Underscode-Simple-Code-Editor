<script setup lang="ts">
import { Tab, useTabOpen } from "@/stores/tabOpen";
import AppOptions from "./AppOptions";
import TabBarItem from "./TabBarItem.vue";

const tabOpen = useTabOpen();

const tabItems = [
  {
    type: Tab.explorer,
    icon: "fa-solid fa-files",
    title: "Folder",
  },
  {
    type: Tab.search,
    icon: "fa-solid fa-magnifying-glass",
    title: "Search",
  },
  // {
  //   type: Tab.git,
  //   icon: "text-3xl fa-brands fa-git-alt",
  // },
];
</script>

<template>
  <div
    class="flex flex-col items-center justify-between py-2 min-w-10 bg-bgSecondary"
  >
    <div class="flex flex-col items-center gap-2">
      <AppOptions />

      <TabBarItem
        v-for="{ icon, type, title } in tabItems"
        :is-active="tabOpen.openTab === type"
        @click="tabOpen.changeOpenTab(type)"
        :title
      >
        <i :class="icon"></i>
      </TabBarItem>
    </div>
    <div class="flex flex-col items-center gap-2">
      <!-- <TabBarItem>
        <i class="fa-solid fa-circle-user"></i>
      </TabBarItem> -->

      <TabBarItem title="Settings">
        <i class="fa-solid fa-gear"></i>
      </TabBarItem>
    </div>
  </div>
</template>
