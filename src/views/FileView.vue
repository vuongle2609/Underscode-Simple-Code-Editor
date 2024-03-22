<script setup lang="ts">
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { useFolderStore } from "@/stores/folder";
import fs from "fs";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { storeToRefs } from "pinia";
import { nextTick, onMounted, ref, shallowRef, watchEffect } from "vue";
const folderStore = useFolderStore();

const editorsOpenStore = useEditorsOpenStore();
const { focusEditor, openEditors } = storeToRefs(editorsOpenStore);

const editorRef = shallowRef<monaco.editor.IStandaloneCodeEditor>();

const MONACO_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    automaticLayout: true,
    formatOnType: false,
    formatOnPaste: false,
    scrollBeyondLastLine: false,
  };

onMounted(() => {
  // https://blog.expo.dev/building-a-code-editor-with-monaco-f84b3a06deaf
  //   monaco.editor.defineTheme('ace', {
  //   base: 'vs',
  //   inherit: true,
  //   rules: [
  //     { token: '', foreground: '5c6773' },
  //     { token: 'invalid', foreground: 'ff3333' },
  //     { token: 'emphasis', fontStyle: 'italic' },
  //     { token: 'strong', fontStyle: 'bold' },
  //     { token: 'variable', foreground: '5c6773' },
  //     { token: 'variable.predefined', foreground: '5c6773' },
  //     { token: 'constant', foreground: 'f08c36' },
  //     { token: 'comment', foreground: 'abb0b6', fontStyle: 'italic' },
  //     { token: 'number', foreground: 'f08c36' },
  //     { token: 'number.hex', foreground: 'f08c36' },
  //     { token: 'regexp', foreground: '4dbf99' },
  //     { token: 'annotation', foreground: '41a6d9' },
  //     { token: 'type', foreground: '41a6d9' },
  //     { token: 'delimiter', foreground: '5c6773' },
  //     { token: 'delimiter.html', foreground: '5c6773' },
  //     { token: 'delimiter.xml', foreground: '5c6773' },
  //     { token: 'tag', foreground: 'e7c547' },
  //     { token: 'tag.id.jade', foreground: 'e7c547' },
  //     { token: 'tag.class.jade', foreground: 'e7c547' },
  //     { token: 'meta.scss', foreground: 'e7c547' },
  //     { token: 'metatag', foreground: 'e7c547' },
  //     { token: 'metatag.content.html', foreground: '86b300' },
  //     { token: 'metatag.html', foreground: 'e7c547' },
  //     { token: 'metatag.xml', foreground: 'e7c547' },
  //     { token: 'metatag.php', fontStyle: 'bold' },
  //     { token: 'key', foreground: '41a6d9' },
  //     { token: 'string.key.json', foreground: '41a6d9' },
  //     { token: 'string.value.json', foreground: '86b300' },
  //     { token: 'attribute.name', foreground: 'f08c36' },
  //     { token: 'attribute.value', foreground: '0451A5' },
  //     { token: 'attribute.value.number', foreground: 'abb0b6' },
  //     { token: 'attribute.value.unit', foreground: '86b300' },
  //     { token: 'attribute.value.html', foreground: '86b300' },
  //     { token: 'attribute.value.xml', foreground: '86b300' },
  //     { token: 'string', foreground: '86b300' },
  //     { token: 'string.html', foreground: '86b300' },
  //     { token: 'string.sql', foreground: '86b300' },
  //     { token: 'string.yaml', foreground: '86b300' },
  //     { token: 'keyword', foreground: 'f2590c' },
  //     { token: 'keyword.json', foreground: 'f2590c' },
  //     { token: 'keyword.flow', foreground: 'f2590c' },
  //     { token: 'keyword.flow.scss', foreground: 'f2590c' },
  //     { token: 'operator.scss', foreground: '666666' }, //
  //     { token: 'operator.sql', foreground: '778899' }, //
  //     { token: 'operator.swift', foreground: '666666' }, //
  //     { token: 'predefined.sql', foreground: 'FF00FF' }, //
  //   ],
  //   colors: {
  //     'editor.background': '#fafafa',
  //     'editor.foreground': '#5c6773',
  //     'editorIndentGuide.background': '#ecebec',
  //     'editorIndentGuide.activeBackground': '#e0e0e0',
  //   },
  // });
});

const mapFileContent = async (id: string | null) => {
  try {
    if (!id) return;

    const currentFocusEditor = openEditors.value.find((item) => item.id === id);

    if (!currentFocusEditor) return;

    const value = await fs.promises.readFile(currentFocusEditor.path, "utf8");

    const newModel =
      monaco.editor.getModel(monaco.Uri.file(currentFocusEditor.path)) ||
      monaco.editor.createModel(
        value,
        undefined,
        monaco.Uri.file(currentFocusEditor.path)
      );

    editorRef.value?.setModel(newModel);
  } catch (err) {
    console.error(err);
  }
};

watchEffect(() => {
  if (focusEditor.value) mapFileContent(focusEditor.value);
});

const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) =>
  (editorRef.value = editor);
</script>

<template>
  <vue-monaco-editor
    theme="vs-dark"
    :options="MONACO_EDITOR_OPTIONS"
    @mount="handleMount"
  />
</template>
