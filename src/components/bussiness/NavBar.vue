<script setup lang="ts">
import { IconSearch, IconFilePlus, IconFolderPlus, IconReload, IconGitBranch, IconExclamationCircle, IconAlertTriangle } from '@tabler/icons-vue'
import IconButton from '../general/IconButton.vue';
import Button from '../general/Button.vue';
</script>

<template>
    <div class="text-white bg-bgMain w-[300px] py-2">
        <!-- start explorer -->
        <div class="flex flex-col h-full">
            <div class="flex items-center justify-between px-4 py-2">
                <span class="text-lg">Explorer</span>

                <div class="flex gap-2">
                    <IconButton title="Search Files">
                        <IconSearch size='1.4rem' stroke="1.5" />
                    </IconButton>

                    <IconButton title="Create File">
                        <IconFilePlus size='1.4rem' stroke="1.5" />
                    </IconButton>

                    <IconButton title="Create Folder">
                        <IconFolderPlus size='1.4rem' stroke="1.5" />
                    </IconButton>

                    <IconButton title="Refresh Explorer">
                        <IconReload size='1.4rem' stroke="1.5" />
                    </IconButton>
                </div>
            </div>

            <div class="px-4 grow">2</div>

            <div class="flex items-center justify-between px-2">
                <Button>
                    <IconGitBranch size='1.4rem' stroke="1.5" />

                    <span class="text-sm">Develop</span>
                </Button>

                <div class="flex gap-4">
                    <span class="flex items-center gap-1 text-xs font-semibold text-red-400">
                        <IconExclamationCircle size='1.1rem' stroke="2" /> 1
                    </span>

                    <span class="flex items-center gap-1 text-xs font-semibold text-yellow-200">
                        <IconAlertTriangle size='1.1rem' stroke="2" /> 2
                    </span>
                </div>
            </div>
        </div>
        <!-- end -->
    </div>
</template>