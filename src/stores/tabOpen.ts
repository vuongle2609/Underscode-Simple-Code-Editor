import { defineStore } from "pinia";
import { ref } from "vue";

export enum Tab {
  explorer,
  search,
  git,
  terminal,
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
