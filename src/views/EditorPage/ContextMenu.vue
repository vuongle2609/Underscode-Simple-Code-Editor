<script setup lang="ts">
import { useContextMenuStore } from "@/stores/contextMenu";
import { onClickOutside, useMouse } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { ListBox, ListBoxItem } from "@/components/general/ListBox";

const target = ref(null);
const { x, y } = useMouse();

const xCal = ref(0);
const yCal = ref(0);

const bottomMenu = "top-0";
const topMenu = "bottom-0";
const rightMenu = "left-0";
const leftMenu = "right-0";

const classesPositionX = ref(bottomMenu);
const classesPositionY = ref(rightMenu);

const contextMenuStore = useContextMenuStore();
const { contextMenu } = storeToRefs(contextMenuStore);

onClickOutside(target, () => {
  contextMenuStore.closeContextMenu();
});

watch(contextMenu, () => {
  xCal.value = x.value;
  yCal.value = y.value;

  const xCondition = x.value > document.documentElement.clientWidth / 2;
  classesPositionX.value = xCondition ? leftMenu : rightMenu;
  const yCondition = y.value > document.documentElement.clientHeight / 2;
  classesPositionY.value = yCondition ? topMenu : bottomMenu;
});
</script>

<template>
  <div
    class="absolute z-[99]"
    ref="target"
    id="contextMenu"
    v-if="!!contextMenu"
    :style="{
      left: xCal + 'px',
      top: yCal + 'px',
    }"
  >
    <div class="relative top-0 bottom-0 left-0 right-0">
      <div
        class="absolute rounded-md overflow-hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] min-w-[100px]"
        :class="[classesPositionX, classesPositionY]"
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
    </div>
  </div>
</template>
