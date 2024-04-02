<script setup lang="ts">
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import isAudio from "@kikopalomares/is-audio";
import isImage from "is-image";
import isVideo from "is-video";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AudioFileView from "./AudioFileView.vue";
import ImageFileView from "./ImageFileView.vue";
import OpenEditors from "./OpenEditors.vue";
import TextFileView from "./TextFileView.vue";
import VideoFileView from "./VideoFileView.vue";

const editorsOpenStore = useEditorsOpenStore();
const { focusEditor, openEditors } = storeToRefs(editorsOpenStore);

const fileDetail = computed(() => {
  const currentFocusEditor = openEditors.value.find(
    (item) => item.id === focusEditor.value
  );

  return currentFocusEditor;
});

enum FileType {
  audio,
  image,
  video,
  other,
}

const fileType = computed(() => {
  const fileName = fileDetail.value?.name || "";

  if (isVideo(fileName)) {
    return FileType.video;
  } else if (isAudio(fileName)) {
    return FileType.audio;
  } else if (isImage(fileName)) {
    return FileType.image;
  } else {
    return FileType.other;
  }
});
</script>

<template>
  <OpenEditors />

  <TextFileView
    v-if="fileDetail && fileType === FileType.other"
    :fileDetail="fileDetail"
  />

  <ImageFileView
    v-if="fileDetail && fileType === FileType.image"
    :fileDetail="fileDetail"
  />

  <VideoFileView
    v-if="fileDetail && fileType === FileType.video"
    :fileDetail="fileDetail"
  />

  <AudioFileView
    v-if="fileDetail && fileType === FileType.audio"
    :fileDetail="fileDetail"
  />
</template>
