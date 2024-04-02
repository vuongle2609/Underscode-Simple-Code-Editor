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
  <div class="grid p-4 size-full place-content-center">
    <video :src="'file://' + fileDetail.path" controls />
  </div>
</template>
