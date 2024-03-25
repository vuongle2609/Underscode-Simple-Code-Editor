<script setup lang="ts">
import TabBarItem from "./TabBarItem.vue";
import Popover from "@/components/general/Popover.vue";
import ListBox from "@/components/general/ListBox.vue";
</script>

<template>
  <Popover v-slot="{ toggle, dropDownClass }">
    <TabBarItem @click="toggle()">
      <i class="fa-solid fa-bars"></i>
    </TabBarItem>

    <div :class="dropDownClass" class="w-[200px]">
      <ListBox />
    </div>
  </Popover>
</template>
