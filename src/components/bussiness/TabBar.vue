<script setup lang="ts">
import TabBarItem from "./TabBarItem.vue";
import AppOptions from "./AppOptions";
import { Tab, useTabOpen } from "@/stores/tabOpen";

const tabOpen = useTabOpen();
</script>

<template>
  <div
    class="flex flex-col items-center justify-between py-2 text-2xl min-w-14 bg-bgSecondary"
  >
    <div class="flex flex-col items-center gap-2">
      <AppOptions />

      <TabBarItem
        :is-active="tabOpen.openTab === Tab.explorer"
        @click="tabOpen.changeOpenTab(Tab.explorer)"
      >
        <i class="fa-solid fa-files"></i>
      </TabBarItem>

      <TabBarItem
        :is-active="tabOpen.openTab === Tab.search"
        @click="tabOpen.changeOpenTab(Tab.search)"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
      </TabBarItem>

      <TabBarItem
        :is-active="tabOpen.openTab === Tab.git"
        @click="tabOpen.changeOpenTab(Tab.git)"
      >
        <i class="text-3xl fa-brands fa-git-alt"></i>
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
