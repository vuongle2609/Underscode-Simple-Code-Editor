<script setup lang="ts">
import { useFolderStore } from "@/stores/folder";
import fs from "fs";
import langDetector from "language-detect";
import langMapper from "language-map";
import { onMounted, ref, shallowRef, watchEffect } from "vue";
const folderStore = useFolderStore();
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const editor = ref();
const lang = ref("");
const code = ref("");

onMounted(() => {
 const a = monaco.editor.create(editor.value, {
    value: code.value,
    language: lang.value,
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    theme: "vs-dark",
  });

});


const mapFileContent = async (path: string) => {
  const data = await fs.promises.readFile(path, "utf8");
  code.value = data;

  //@ts-ignore
  const langDetected = await langDetector.sync(path);

  lang.value = langMapper[langDetected as keyof typeof langMapper].aceMode;
};

watchEffect(() => {
  if (folderStore.openFile) mapFileContent(folderStore.openFile);
});
</script>

<template><div id="editor" ref="editor" class="w-full h-full"></div></template>
