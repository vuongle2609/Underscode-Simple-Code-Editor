<script setup lang="ts">
import { useContextMenuStore } from "@/stores/ContextMenu";
import { onClickOutside, useMouse } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { ListBox, ListBoxItem } from "@/components/general/ListBox";

const target = ref(null);
const { x, y } = useMouse();

const xCal = ref(0);
const yCal = ref(0);

const contextMenuStore = useContextMenuStore();
const { contextMenu } = storeToRefs(contextMenuStore);

onClickOutside(target, () => {
  contextMenuStore.closeContextMenu();
});

watch(contextMenu, () => {
  xCal.value = x.value;
  yCal.value = y.value;
});
</script>

<template>
  <div
    ref="target"
    class="absolute z-[99] rounded-md overflow-hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] min-w-[100px]"
    id="contextMenu"
    :style="{
      left: xCal + 'px',
      top: yCal + 'px',
    }"
    v-if="!!contextMenu"
  >
    <ListBox>
      <ListBoxItem
        v-for="{ action, label } of contextMenu"
        @click="
          () => {
            action?.();
            contextMenuStore.closeContextMenu();
          }
        "
        >{{ label }}</ListBoxItem
      >
    </ListBox>
  </div>
</template>
