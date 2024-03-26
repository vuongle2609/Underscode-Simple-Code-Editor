<script setup lang="ts">
import TabBarItem from "../TabBarItem.vue";
import Popover from "@/components/general/Popover.vue";
import { ListBox } from "@/components/general/ListBox";
import Item from "./Item.vue";

export type OptionType = {
  label: string;
  icon?: string;
  items?: OptionType[];
  action?: () => void;
};

const options: OptionType[] = [
  { label: "File", icon: "fa-file", items: [] },
  { label: "View", icon: "fa-sidebar" },
  { label: "Edit", icon: "fa-file-pen" },
  { label: "About", icon: "fa-memo-circle-info" },
];
</script>

<template>
  <Popover v-slot="{ toggle, dropDownClass }">
    <TabBarItem @click="toggle()">
      <i class="fa-solid fa-bars"></i>
    </TabBarItem>

    <div :class="dropDownClass" class="w-[200px]">
      <ListBox>
        <Item v-for="{ label, icon } in options" :label :icon></Item>
      </ListBox>
    </div>
  </Popover>
</template>
