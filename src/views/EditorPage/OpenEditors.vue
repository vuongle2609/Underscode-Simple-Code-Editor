<script setup lang="ts">
import Button from "@/components/general/IconButton.vue";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue";

const editorsOpenStore = useEditorsOpenStore();
const { openEditors, focusEditor } = storeToRefs(editorsOpenStore);
import hotkeys from "hotkeys-js";
const fs = require("fs-extra");

const scrollContainer = ref();

watchEffect(() => {
  document.getElementById(focusEditor.value || "")?.scrollIntoView();
});

const scrollX = (e: WheelEvent) => {
  scrollContainer.value.scrollLeft += e.deltaY;
};

const closeEditor = async (id?: string | null) => {
  if (!id) return;

  const itemRemove = await editorsOpenStore.removeEditor(id);

  const path = itemRemove?.path || "";

  monaco.editor.getModel(monaco.Uri.file(path))?.dispose();
};

const handleSaveEditor = async () => {
  const currentFocusEditor = openEditors.value.find(
    (item) => item.id === focusEditor.value
  );

  if (!currentFocusEditor) return;

  const newValue = monaco.editor.getEditors()[0].getValue() || "";

  fs.writeFileSync(currentFocusEditor.path, newValue);
};

onMounted(() => {
  hotkeys("ctrl+w,command+w", () => {
    closeEditor(focusEditor.value);
  });

  hotkeys("ctrl+s,command+s", () => {
    handleSaveEditor();
  });
});

onBeforeUnmount(() => {
  hotkeys.unbind("ctrl+w,command+w");
  hotkeys.unbind("ctrl+s,command+s");
});
</script>

<template>
  <div
    class="w-full h-full overflow-x-scroll overflow-y-hidden grow max-h-10 min-h-10 hideScrollbar"
    ref="scrollContainer"
    v-if="openEditors.length"
    @mousewheel="scrollX"
  >
    <div
      class="flex divide-x select-none size-full divide-bgButtonHover bg-bgMain"
    >
      <div
        v-for="{ fileClass, name, id } of openEditors"
        @click="editorsOpenStore.focusEditor = id"
        :id
        class="flex items-center justify-center h-full gap-1 px-2 pl-4 text-xs transition-colors duration-150 cursor-pointer text-textSecondary hover:text-textMain hover:bg-bgSecondary whitespace-nowrap"
        :class="focusEditor === id ? 'bg-bgSecondary text-white' : 'bg-bgMain'"
        @click.middle.exact="closeEditor(id)"
      >
        <i class="icon" :class="fileClass"></i>

        <span>{{ name }}</span>

        <Button size="sm" @click="closeEditor(id)"
          ><i class="fa-solid fa-xmark"></i
        ></Button>
      </div>

      <div></div>
    </div>
  </div>
</template>
