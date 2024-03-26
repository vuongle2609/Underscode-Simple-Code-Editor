<script setup lang="ts">
import { ListBoxItem } from "@/components/general/ListBox";
import Popover from "@/components/general/Popover.vue";
import { type OptionType } from "./List.vue";

defineProps<OptionType>();
</script>

<template>
  <Popover v-slot="{ dropDownClass }" :activeWithHover="true">
    <ListBoxItem :icon>{{ label }}</ListBoxItem>

    <div :class="dropDownClass">wdeedw</div>
  </Popover>
</template>
