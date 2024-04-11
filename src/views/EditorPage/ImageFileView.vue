<script setup lang="ts">
interface PropsType {
  fileDetail: {
    name: string;
    path: string;
    fileClass: string;
    id: string;
  };
}

const { fileDetail } = defineProps<PropsType>();
</script>

<template>
  <div class="flex items-center justify-center p-4 size-full">
    <img :src="'file://' + fileDetail.path" :alt="fileDetail.name" class="max-h-[80%] max-w-[80%]"/>
  </div>
</template>
