<script setup lang="ts">
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { useFolderStore } from "@/stores/folder";
import isAudio from "@kikopalomares/is-audio";
import fs from "fs";
import isImage from "is-image";
import isVideo from "is-video";
import { storeToRefs } from "pinia";
import { computed, onMounted, toRef, watch } from "vue";
import { useToast } from "vue-toastification";
import AudioFileView from "./AudioFileView.vue";
import ContextMenu from "./ContextMenu.vue";
import ImageFileView from "./ImageFileView.vue";
import OpenEditors from "./OpenEditors.vue";
import TerminalView from "./TerminalView.vue";
import TextFileView from "./TextFileView.vue";
import VideoFileView from "./VideoFileView.vue";

const folderStore = useFolderStore();
const editorsOpenStore = useEditorsOpenStore();
const { focusEditor, openEditors } = storeToRefs(editorsOpenStore);

const toast = useToast();

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

const openFolderRef = toRef(folderStore.openFolder);

const checkIsDirExist = async () => {
  try {
    fs.readdirSync(openFolderRef.value || "");
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
    }

    folderStore.openFolder = null;
  }
};

watch(openFolderRef, async () => {
  checkIsDirExist();
});

onMounted(() => {
  checkIsDirExist();
});
</script>

<template>
  <OpenEditors />

  <ContextMenu />

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

  <TerminalView />
</template>
