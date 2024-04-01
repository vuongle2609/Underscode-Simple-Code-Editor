<script setup lang="ts">
import { useFolderStore } from "@/stores/folder";
import { getClassWithColor } from "file-icons-js";
import path from "path";
import { LineResult } from "search-in-file/dist/types";

interface PropsType {
  files: LineResult[];
  input: string;
}

const { files, input } = defineProps<PropsType>();

const folderStore = useFolderStore();
</script>

<template>
  <div class="py-1">
    <div
      :title="files[0].filePath"
      class="flex items-center justify-between w-full max-w-full gap-2 px-2 py-1 rounded-md hover:bg-bgSecondary"
    >
      <div class="flex gap-2 overflow-hidden grow">
        <i
          class="icon"
          :class="
            getClassWithColor(path.basename(files[0].filePath)) ||
            getClassWithColor('sample.txt')
          "
        ></i>

        <span
          class="block overflow-hidden grow whitespace-nowrap text-ellipsis"
          >{{ path.basename(files[0].filePath) }}</span
        >

        <!-- <span class="text-xs text-gray-400">{{
          files[0].filePath.replace(folderStore.openFolder || "", "")
        }}</span> -->
      </div>

      <div
        class="text-xs"
      >
        {{ files.length }}
      </div>
    </div>

    <div
      v-for="{ line, lineNo } in files"
      class="px-2 py-1 overflow-hidden text-gray-500 rounded-md cursor-pointer hover:text-white hover:bg-bgSecondary whitespace-nowrap text-ellipsis"
      :title="line"
      v-html="
        line
          .split(input)
          .join(`<span class='text-white bg-bgButtonHover'>${input}</span>`)
      "
    ></div>
  </div>
</template>
