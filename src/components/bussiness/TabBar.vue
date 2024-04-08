<script setup lang="ts">
import { Tab, useTabOpen } from "@/stores/tabOpen";
import AppOptions from "./AppOptions";
import TabBarItem from "./TabBarItem.vue";

const tabOpen = useTabOpen();

const tabItems = [
  {
    type: Tab.explorer,
    icon: "fa-solid fa-files",
  },
  {
    type: Tab.search,
    icon: "fa-solid fa-magnifying-glass",
  },
  // {
  //   type: Tab.git,
  //   icon: "text-3xl fa-brands fa-git-alt",
  // },
];
</script>

<template>
  <div
    class="flex flex-col items-center justify-between py-2 text-2xl min-w-14 bg-bgSecondary"
  >
    <div class="flex flex-col items-center gap-2">
      <AppOptions />

      <TabBarItem
        v-for="{ icon, type } in tabItems"
        :is-active="tabOpen.openTab === type"
        @click="tabOpen.changeOpenTab(type)"
      >
        <i :class="icon"></i>
      </TabBarItem>
    </div>
    <div class="flex flex-col items-center gap-2">
      <!-- <TabBarItem>
        <i class="fa-solid fa-circle-user"></i>
      </TabBarItem> -->

      <TabBarItem>
        <i class="fa-solid fa-gear"></i>
      </TabBarItem>
    </div>
  </div>
</template>
