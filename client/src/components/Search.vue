<template>
    <form
        class="flex items-center"
        @submit.prevent="$emit('search', searchTerm)"
        action=""
    >
        <div class="border-2 border-red-600">
            <input
                v-model="searchTerm"
                type="text"
                class="outline-none px-2 py-1 bg-red-400 text-gray-800"
                placeholder="🔍🔎🔍🔎"
            />
        </div>
        <button
            type="submit"
            class="ml-2 bg-red-400 hover:bg-red-600 border-2 border-red-600"
        >
            🔍
        </button>
    </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "Search",
    emits: ["search"],
    setup() {
        const searchTerm = ref("");
        return { searchTerm };
    },
});
</script>
