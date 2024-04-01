<script setup lang="ts">
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { getClassWithColor } from "file-icons-js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import path from "path";
import { LineResult } from "search-in-file/dist/types";
interface PropsType {
  files: LineResult[];
  input: string;
}

const { files, input } = defineProps<PropsType>();

const { addEditorWithPath } = useEditorsOpenStore();

const handleClickResult = (
  path: string,
  line: string,
  lineNo: number,
  input: string
) => {
  addEditorWithPath(path);

  const lineSplit = line.split(input);

  const startCursor = lineSplit[0].length + 1;
  const endCursor = startCursor + input.length;

  setTimeout(() => {
    monaco.editor.getEditors()[0].revealLineInCenter(lineNo);

    monaco.editor
      .getEditors()[0]
      .setSelection(
        new monaco.Selection(lineNo, startCursor, lineNo, endCursor)
      );
  }, 100);
};
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

      <div class="text-xs">
        {{ files.length }}
      </div>
    </div>

    <div
      v-for="{ line, lineNo, filePath } in files"
      class="px-2 py-1 overflow-hidden text-gray-500 rounded-md cursor-pointer hover:text-white hover:bg-bgSecondary whitespace-nowrap text-ellipsis"
      :title="line"
      @click="handleClickResult(filePath, line, lineNo, input)"
      v-html="
        line
          .split(input)
          .join(`<span class='text-white bg-bgButtonHover'>${input}</span>`)
      "
    ></div>
  </div>
</template>
