import { defineStore } from "pinia";
import { LineResult } from "search-in-file/dist/types";
import { ref } from "vue";

export const useSearchDirStore = defineStore("searchDir", () => {
  const searchText = ref("");
  const searchResult = ref<LineResult[][]>([]);

  return {
    searchText,
    searchResult,
  };
});
