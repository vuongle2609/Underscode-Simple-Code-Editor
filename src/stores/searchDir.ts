import { defineStore } from "pinia";
import { LineResult } from "search-in-file/dist/types";
import { ref } from "vue";

export const useSearchDirStore = defineStore("searchDir", () => {
  const searchText = ref("");
  const exclude = ref("node_modules,.git,dist,build,.exe,.dmg,.dll");
  const searchResult = ref<LineResult[][]>([]);

  return {
    searchText,
    exclude,
    searchResult,
  };
});
