<script setup lang="ts">
import { ListBoxItem } from "@/components/general/ListBox";
import Popover from "@/components/general/Popover.vue";
import { type OptionType } from "./List.vue";
import { ListBox } from "@/components/general/ListBox";

defineProps<{
  label: string;
  icon?: string;
  options: OptionType[];
  closePopover: () => void;
}>();
</script>

<template>
  <Popover v-slot="{ dropDownClass }" :activeWithHover="true">
    <ListBoxItem :icon>{{ label }}</ListBoxItem>

    <div :class="dropDownClass" class="min-w-[200px]" v-if="options.length">
      <ListBox>
        <ListBoxItem
          v-for="{ label, action } in options"
          @click="
            () => {
              action?.();
              closePopover();
            }
          "
          >{{ label }}</ListBoxItem
        >
      </ListBox>
    </div>
  </Popover>
</template>
