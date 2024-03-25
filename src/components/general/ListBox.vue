<script setup lang="ts">
import Button from "@/components/general/Button.vue";

const options = [
  { label: "File" },
  { label: "View" },
  { label: "Edit" },
  { label: "About" },
];
</script>

<template>
  <div class="flex flex-col p-1">
    <template v-for="{ label } in options">
      <Button>
        <span class="text-sm text-white">{{ label }}</span></Button
      >
    </template>
  </div>
</template>
