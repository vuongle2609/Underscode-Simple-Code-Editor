<script setup lang="ts">
import IconButton from "@/components/general/IconButton.vue";
import { useFolderStore } from "@/stores/folder";
import { useSearchDirStore } from "@/stores/searchDir";
import { readDirRecursiveFlat } from "@/utils/file";
import { refDebounced } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { fileSearch } from "search-in-file";
import { LineResult, SearchOptions } from "search-in-file/dist/types";
import { onMounted, ref, watch } from "vue";
import SearchItem from "./SeachItem.vue";

const inputSearchRef = ref<HTMLInputElement>();

const searchDirStore = useSearchDirStore();
const { searchResult, searchText } = storeToRefs(searchDirStore);

const exclude = ref("node_modules,.git,dist,release,build,.exe");
const debounced = refDebounced(searchText, 700);

const folderStore = useFolderStore();

const actionButtons = [
  {
    title: "Refresh Explorer",
    icon: "fa-rotate-right",
    click: () => searchFile(),
  },
];

const searchFile = async () => {
  if (!folderStore.openFolder || !debounced.value) {
    searchResult.value = [];
    return;
  }

  const ignorePath = exclude.value.split(",");

  const paths = readDirRecursiveFlat({
    dir: folderStore.openFolder || "",
    excludeDir: ignorePath,
  });

  const result = await fileSearch(paths, debounced.value, {
    searchResults: "lineNo",
    recursive: false,
  } as SearchOptions);

  searchResult.value = result as unknown as LineResult[][];
};

watch(debounced, () => {
  searchFile();
});

onMounted(() => {
  inputSearchRef.value?.focus();
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-4 py-1 bg-bgMain">
      <span class="text-sm font-light">Search</span>

      <div class="flex">
        <template v-for="{ icon, title, click } in actionButtons">
          <IconButton :title @click="click">
            <i :class="['fa-solid', icon]"></i>
          </IconButton>
        </template>
      </div>
    </div>

    <div class="px-4 py-1">
      <input
        ref="inputSearchRef"
        type="text"
        placeholder="Typing to search..."
        v-model="searchText"
        class="w-full py-1 pl-2 text-sm rounded-md outline-none bg-bgSecondary"
      />
    </div>

    <div class="px-4 py-1">
      <label for="exclude_search" class="text-xs text-gray-400"
        >Directory to exclude</label
      >
      <input
        type="text"
        id="exclude_search"
        placeholder="eg. .ts,.js,node_modules"
        v-model="exclude"
        class="w-full py-1 pl-2 text-sm rounded-md outline-none bg-bgSecondary"
      />
    </div>

    <perfect-scrollbar
      class="px-2 py-2 overflow-x-hidden overflow-y-auto text-sm grow"
    >
      <SearchItem
        v-for="files in searchResult"
        :input="debounced"
        :files="files"
      />
    </perfect-scrollbar>
  </div>
</template>
