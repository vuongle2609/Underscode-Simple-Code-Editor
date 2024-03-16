<script setup lang="ts">
import {
    IconFiles,
    IconSearch,
    IconBrandGit,
    IconMenu2,
    IconSettings,
    IconUserCircle,
} from "@tabler/icons-vue";
import TabBarItem from "./TabBarItem.vue";
</script>

<template>
    <div class="flex flex-col justify-between py-2 bg-bgSecondary">
        <div>
            <TabBarItem>
                <IconMenu2 size="2rem" stroke="1.5" />
            </TabBarItem>

            <TabBarItem :is-active="true" >
                <IconFiles size="2rem" stroke="1.5" />
            </TabBarItem>

            <TabBarItem>
                <IconSearch size="2rem" stroke="1.5" />
            </TabBarItem>

            <TabBarItem>
                <IconBrandGit size="2rem" stroke="1.5" />
            </TabBarItem>
        </div>
        <div>
            <TabBarItem>
                <IconSettings size="2rem" stroke="1.5" />
            </TabBarItem>

            <TabBarItem>
                <IconUserCircle size="2rem" stroke="1.5" />
            </TabBarItem>
        </div>
    </div>
</template>
