<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-vue";

const { name, isFile, fileClass, isOpen } = defineProps<{
  name: string;
  isFile: boolean;
  fileClass: string;
  isOpen: boolean;
}>();
</script>

<template>
  <Button v-if="name !== '.git'" :full-width="true" :v-bind="$props">
    <IconChevronRight
      v-if="!isOpen"
      size="1.4rem"
      stroke="1.5"
      :class="isFile && 'invisible'"
    />
    <IconChevronDown
      v-if="isOpen"
      size="1.4rem"
      stroke="1.5"
      :class="isFile && 'invisible'"
    />

    <i class="icon" :class="fileClass" v-if="isFile"></i>

    <span
      class="overflow-hidden text-sm font-light whitespace-nowrap text-ellipsis"
    >
      {{ name }}</span
    >
  </Button>
</template>
