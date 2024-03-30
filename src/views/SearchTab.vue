<!-- https://www.npmjs.com/package/fast-find-in-files -->
<script setup lang="ts">
import IconButton from "@/components/general/IconButton.vue";
import { useFolderStore } from "@/stores/folder";
import { ref, computed, watch, nextTick } from "vue";
import { fileSearch, getFilesFromDir } from "search-in-file";
import {
  LineResult,
  SearchOptions,
  SearchResults,
} from "search-in-file/dist/types";
import { refDebounced } from "@vueuse/core";
import path from "path";

const input = ref("");
const debounced = refDebounced(input, 300);

const folderStore = useFolderStore();

const searchResult = ref<LineResult[]>([]);

const actionButtons = [
  {
    title: "Refresh Explorer",
    icon: "fa-rotate-right",
    click: () => console.log(1),
  },
];

const searchFile = async () => {
  if (!folderStore.openFolder || !debounced.value) return;

  const paths = await getFilesFromDir(folderStore.openFolder, false, true);
console.log(paths)
console.log([path.join(folderStore.openFolder)])
  const result = await fileSearch([path.join(folderStore.openFolder)], debounced.value, {
    searchResults: "lineNo",
    recursive: true,
  } as SearchOptions);

  //   console.log("🚀 ~ searchFile ~ result:", result);
  searchResult.value = result as unknown as LineResult[];

  nextTick(() => console.log(searchResult.value));
};

watch(debounced, () => {
  searchFile();
});

// const searchResult = computed(() => fileSearch(paths, debounced.value, {}));
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

    <perfect-scrollbar class="py-2 pr-4 overflow-x-hidden overflow-y-auto grow">
      <div v-for="{ filePath, line, lineNo } in searchResult">
        {{ filePath }}, {{ line }},
        {{ lineNo }}
      </div>
    </perfect-scrollbar>
  </div>
</template>
