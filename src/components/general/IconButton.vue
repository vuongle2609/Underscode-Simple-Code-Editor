<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

interface Props extends /** @vue-ignore */ ButtonHTMLAttributes {
    size?: 'sm' | 'md' | 'lg' | 'xl',
    variant?: 'filled' | 'subtle'
}

const { size, variant } = defineProps<Props>()

const sizeStyle = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
}

const variantStyle = {
    filled: 'bg-bgButton',
    subtle: '',
}


</script>

<template>
    <button :class="[sizeStyle[size || 'md'], variantStyle[variant || 'subtle']]"
        class="px-1 py-1 rounded-md hover:bg-bgButtonHover active:bg-bgSecondary" v-bind="$props">
        <slot />
    </button>
</template>
