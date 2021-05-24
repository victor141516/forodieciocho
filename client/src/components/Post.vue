<template>
    <a
        class="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg rounded-tl-none border-2 border-blue-300"
        :href="`https://www.forocoches.com/foro/showthread.php?t=${post.id}`"
        target="_blank"
    >
        <div class="flex mr-2 w-20">
            <span class="mx-auto my-auto">{{ getPostIcon(post) }}</span>
        </div>
        <span>{{ post.title }}</span></a
    >
</template>

<script lang="ts">
import { PropType } from "@vue/runtime-core";
import { defineComponent } from "vue";

import { Post } from "../libs/post";

export default defineComponent({
    name: "Post",
    props: {
        post: {
            type: Object as PropType<Post>,
            required: true,
        },
    },
    setup(props) {
        const categories: Record<string, string> = {
            "+18": "👉👌",
            "+16": "🎈🎈",
            "+14": "🍑🍑",
            unknown: "❓❔",
        };
        const getPostIcon = (post: Post): string => {
            return categories[post.category] ?? categories.unknown;
        };
        return {
            post: props.post,
            getPostIcon,
        };
    },
});
</script>