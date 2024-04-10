import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useContextMenuStore = defineStore("contextMenu", () => {
  const contextMenu = ref<{ label: string; action: () => void }[] | null>(null);

  const closeContextMenu = () => {
    contextMenu.value = null;
  };

  const openContextMenu = async (
    props: { label: string; action: () => void }[]
  ) => {
    await nextTick();
    contextMenu.value = props;
  };

  return { contextMenu, closeContextMenu, openContextMenu };
});
