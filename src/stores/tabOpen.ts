import { defineStore } from "pinia";
import { nextTick, ref } from "vue";
import * as remote from "@electron/remote";

export enum Tab {
  explorer,
  search,
  git,
}

export const useTabOpen = defineStore("tab", () => {
  const openTab = ref<Tab>(Tab.explorer);

  const changeOpenTab = (newTab: Tab) => {
    openTab.value = newTab;
  };

  return {
    openTab,
    changeOpenTab,
  };
});
