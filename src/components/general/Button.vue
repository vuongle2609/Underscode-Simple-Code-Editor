<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

interface Props extends /** @vue-ignore */ ButtonHTMLAttributes {
    size?: 'sm' | 'md' | 'lg' | 'xl',
}

const { size } = defineProps<Props>()

const sizeStyle = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
}

const buttonSize = sizeStyle[size || 'md']
</script>

<template>
    <button :class="[buttonSize]" class="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-bgButtonHover active:bg-bgSecondary" v-bind="$props">
        <slot />
    </button>
</template>
