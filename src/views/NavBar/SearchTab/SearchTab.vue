<script setup lang="ts">
import IconButton from "@/components/general/IconButton.vue";
import { useFolderStore } from "@/stores/folder";
import { useSearchDirStore } from "@/stores/searchDir";
import { readDirRecursiveFlat } from "@/utils/file";
import { chunksArray } from "@/utils/common";
import { refDebounced } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { fileSearch } from "search-in-file";
import { LineResult, SearchOptions } from "search-in-file/dist/types";
import { nextTick, onMounted, ref, watch } from "vue";
import SearchItem from "./SeachItem.vue";

const inputSearchRef = ref<HTMLInputElement>();

const searchDirStore = useSearchDirStore();
const { exclude } = storeToRefs(searchDirStore);

const searchText = ref("");
const searchResult = ref<LineResult[][]>([]);

const timeOutSearch = ref<NodeJS.Timeout[]>([]);

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
  timeOutSearch.value.forEach((item) => {
    if (item) clearTimeout(item);
  });

  searchResult.value = [];

  await nextTick();

  if (!folderStore.openFolder || !debounced.value) {
    return;
  }

  const ignorePath = exclude.value.split(",");

  const paths = readDirRecursiveFlat({
    dir: folderStore.openFolder || "",
    excludeDir: ignorePath,
  });

  const pathsChunk = chunksArray(paths, 20);

  const findText = async (path: string) => {
    try {
      const result = await fileSearch([path], debounced.value, {
        searchResults: "lineNo",
        recursive: false,
      } as SearchOptions);

      if (result[0]) searchResult.value.push(result[0] as LineResult[]);
    } catch {}
  };

  const timeOutSearchMap = pathsChunk.map((paths, index) => {
    return setTimeout(() => {
      Promise.all(paths.map(findText));
    }, index * 100);
  });

  timeOutSearch.value = timeOutSearchMap;
};

watch(debounced, () => {
  searchFile();
});

onMounted(() => {
  inputSearchRef.value?.focus();
});
</script>

<template>
  <div class="flex flex-col size-full">
    <div class="flex items-center justify-between px-4 py-2 bg-bgMain">
      <span class="text-xs font-light">Search</span>

      <div class="flex">
        <template v-for="{ icon, title, click } in actionButtons">
          <IconButton :title @click="click" size="sm">
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
        class="w-full py-1 pl-2 text-xs rounded-md outline-none bg-bgSecondary"
      />
    </div>

    <div class="px-4 py-1">
      <label for="exclude_search" class="text-[10px] text-gray-400"
        >Directory to exclude</label
      >
      <input
        type="text"
        id="exclude_search"
        placeholder="eg. .ts,.js,node_modules"
        v-model="exclude"
        class="w-full py-1 pl-2 text-xs rounded-md outline-none bg-bgSecondary"
      />
    </div>

    <div class="px-2 py-2 overflow-x-hidden overflow-y-auto text-xs grow">
      <SearchItem
        v-for="files in searchResult"
        :input="debounced"
        :files="files"
      />
    </div>
  </div>
</template>
