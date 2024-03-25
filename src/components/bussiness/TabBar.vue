<script setup lang="ts">
import TabBarItem from "./TabBarItem.vue";
import Popover from "@/components/general/Popover.vue";
</script>

<template>
  <div
    class="flex flex-col items-center justify-between py-2 text-2xl min-w-14 bg-bgSecondary"
  >
    <div class="flex flex-col items-center gap-2">
      <Popover v-slot="{ click }">
        <TabBarItem @click="click()">
          <i class="fa-solid fa-bars"></i>
        </TabBarItem>
      </Popover>

      <TabBarItem :is-active="true">
        <i class="fa-solid fa-files"></i>
      </TabBarItem>

      <TabBarItem>
        <i class="fa-solid fa-magnifying-glass"></i>
      </TabBarItem>

      <TabBarItem>
        <i class="text-3xl fa-brands fa-git-alt"></i>
      </TabBarItem>
    </div>
    <div class="flex flex-col items-center gap-2">
      <TabBarItem>
        <i class="fa-solid fa-circle-user"></i>
      </TabBarItem>

      <TabBarItem>
        <i class="fa-solid fa-gear"></i>
      </TabBarItem>
    </div>
  </div>
</template>
