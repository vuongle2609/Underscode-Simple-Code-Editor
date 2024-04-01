<script setup lang="ts">
import IconButton from "@/components/general/IconButton.vue";
import { useFolderStore } from "@/stores/folder";
import { refDebounced } from "@vueuse/core";
import path from "path";
import { fileSearch, getFilesFromDir } from "search-in-file";
import { LineResult, SearchOptions } from "search-in-file/dist/types";
import { ref, watch } from "vue";
import SearchItem from "./SeachItem.vue";
import fs from "fs";
import { readDirRecursive, readDirRecursiveFlat } from "@/utils/file";

const input = ref("");
const debounced = refDebounced(input, 700);

const folderStore = useFolderStore();

const searchResult = ref<LineResult[][]>([]);

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

  const paths = await getFilesFromDir(folderStore.openFolder, true, false);

  const pathsSearch = (paths.flat(Infinity) as string[]) || [];

  const ignorePath = [
    ".git",
    ".exe",
    "node_modules",
    "bower_components",
    "tmp",
    "dist",
    "build",
    "release",
  ];

  console.log(
    readDirRecursiveFlat({
      dir: folderStore.openFolder || "",
      excludeDir: ignorePath,
    })
  );

  const a = pathsSearch.filter(
    (item) =>
      !ignorePath.some((path) =>
        path.includes(".") && path !== ".git"
          ? item.includes(path)
          : item.includes(`\\${path}\\`)
      )
  );

  const result = await fileSearch(a, debounced.value, {
    searchResults: "lineNo",
    recursive: false,
  } as SearchOptions);

  searchResult.value = result as unknown as LineResult[][];
};

watch(debounced, () => {
  searchFile();
});
//dev
searchFile();
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
        type="text"
        placeholder="Typing to search..."
        v-model="input"
        class="w-full py-1 pl-2 text-sm rounded-md outline-none bg-bgSecondary"
      />
    </div>

    <perfect-scrollbar
      class="px-2 py-2 overflow-x-hidden overflow-y-auto text-sm grow"
    >
      <SearchItem v-for="files in searchResult" :input="input" :files="files" />
    </perfect-scrollbar>
  </div>
</template>
