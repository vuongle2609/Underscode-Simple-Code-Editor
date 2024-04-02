import { defineStore } from "pinia";
import { ref } from "vue";

export const usePathOpenStore = defineStore("pathOpen", () => {
  const openFolderPath = ref<string[]>([]);

  const openFolder = (pathOpen: string) => {
    if (openFolderPath.value.includes(pathOpen)) {
      openFolderPath.value = [
        ...openFolderPath.value.filter((item) => item !== pathOpen),
      ];

      return;
    }
    openFolderPath.value.push(pathOpen);
  };

  return { openFolder, openFolderPath };
});
