<template>
    <div class="flex text-xl">
        <span
            @click="$emit('previous')"
            class="w-8 h-8 bg-red-400 hover:bg-red-600 border-2 border-red-600 flex items-center justify-center cursor-pointer"
            >⬅️</span
        >
        <span
            class="w-7 h-8 bg-red-400 border-t-2 border-b-2 border-red-600 flex items-center justify-center"
            >{{ page + 1 }}</span
        >
        <span
            @click="$emit('next')"
            class="w-8 h-8 bg-red-400 hover:bg-red-600 border-2 border-red-600 flex items-center justify-center cursor-pointer"
            >➡️</span
        >
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "PageControl",
    emits: ["next", "previous"],
    props: {
        page: {
            type: Number,
            required: true,
        },
    },
});
</script>
