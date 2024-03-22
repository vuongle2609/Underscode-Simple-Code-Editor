<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { useEditorsOpenStore } from "@/stores/editorsOpen";

const { name, isFile, fileClass, isOpen, path } = defineProps<{
  name: string;
  isFile: boolean;
  fileClass: string;
  isOpen: boolean;
  path: string;
}>();

const { addEditor } = useEditorsOpenStore();

const handleClickItem = () => {
  if (!isFile) return;

  addEditor({
    path,
    name,
    fileClass,
  });
};
</script>

<template>
  <Button
    v-if="name !== '.git'"
    :full-width="true"
    :v-bind="$props"
    @click="handleClickItem"
  >
    <i
      class="text-xs fa-light fa-chevron-right"
      v-if="!isOpen"
      :class="isFile && 'invisible'"
    ></i>
    <i
      class="text-xs fa-light fa-chevron-down"
      v-if="isOpen"
      :class="isFile && 'invisible'"
    ></i>

    <i class="icon" :class="fileClass" v-if="isFile"></i>

    <span
      class="overflow-hidden text-sm font-light whitespace-nowrap text-ellipsis"
    >
      {{ name }}</span
    >
  </Button>
</template>
