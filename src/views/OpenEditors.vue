<script setup lang="ts">
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { storeToRefs } from "pinia";
import Button from "@/components/general/IconButton.vue";
import { watchEffect, ref } from "vue";

const editorsOpenStore = useEditorsOpenStore();
const { openEditors, focusEditor } = storeToRefs(editorsOpenStore);

const scrollContainer = ref();

watchEffect(() => {
  document.getElementById(focusEditor.value || "")?.scrollIntoView();
});

const scrollX = (e: WheelEvent) => {
  scrollContainer.value.scrollLeft += e.deltaY;
};
</script>

<template>
  <div
    class="h-10 overflow-x-scroll overflow-y-hidden grow hideScrollbar"
    ref="scrollContainer"
    @mousewheel="scrollX"
  >
    <div class="flex divide-x size-full divide-bgButtonHover bg-bgMain">
      <div
        v-for="{ fileClass, name, id } of openEditors"
        @click="editorsOpenStore.focusEditor = id"
        :id
        class="flex items-center justify-center h-full gap-2 px-2 pl-4 transition-all duration-150 cursor-pointer text-textSecondary hover:text-white hover:bg-bgSecondary whitespace-nowrap"
        :class="focusEditor === id ? 'bg-bgSecondary text-white' : 'bg-bgMain'"
      >
        <i class="icon" :class="fileClass"></i>

        {{ name }}

        <Button size="sm" @click="editorsOpenStore.removeEditor(id)"
          ><i class="fa-solid fa-xmark"></i
        ></Button>
      </div>

      <div></div>
    </div>
  </div>
</template>
