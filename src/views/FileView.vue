<script setup lang="ts">
import { useFolderStore } from "@/stores/folder";
import { ref, onMounted, shallowRef, watchEffect } from "vue";
// import fs from "fs";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
const folderStore = useFolderStore();
const editor = ref();
onMounted(() => {
  monaco.editor.create(editor.value, {
    value: `// Type source code in your language here...
    class MyClass {
      @attribute
      void main() {
    Console.writeln( "Hello Monarch world\n");
  }
}`,
  });
});
// const code = ref("");
// watchEffect(() => {
//   if (folderStore.openFile)
//     fs.readFile(folderStore.openFile, "utf8", (err, data) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       code.value = data;
//     });
// });

// const MONACO_EDITOR_OPTIONS = {
//   automaticLayout: true,
//   formatOnType: true,
//   formatOnPaste: true,
// };

// const editorRef = shallowRef();
// const handleMount = (editor: string) => (editorRef.value = editor);
</script>

<template>
  <!-- <vue-monaco-editor
    v-model:value="code"
    theme="vs-dark"
    :options="MONACO_EDITOR_OPTIONS"
    @mount="handleMount"
  /> -->  <div id="editor" ref="editor" class="w-full h-full"></div>
</template>
