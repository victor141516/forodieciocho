<template>
    <div class="flex">
        <span
            @click="$emit('previous')"
            class="w-6 h-6 bg-red-400 hover:bg-red-600 border-2 border-red-600 flex items-center justify-center cursor-pointer"
            >&lt;</span
        >
        <span
            @click="$emit('next')"
            class="w-6 h-6 bg-red-400 hover:bg-red-600 border-2 border-red-600 flex items-center justify-center cursor-pointer"
            >&gt;</span
        >
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "PageControl",
    emits: ["next", "previous"],
});
</script>
