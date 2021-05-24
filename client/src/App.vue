<template>
    <div class="2xl:w-2/5 xl:w-1/2 md:w-3/4 md:mx-auto sm:mx-2">
        <img class="mx-auto" alt="Logo" src="./assets/logo.png" />
        <div class="mt-12">
            <div v-if="posts.length > 0">
                <PageControl
                    @next="goToNextPage"
                    @previous="goToPreviousPage"
                ></PageControl>
                <Post
                    class="my-2 flex"
                    v-for="post in posts"
                    :key="post.id"
                    :post="post"
                ></Post>
            </div>
            <div v-else>
                <p>LOADING...</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import { Post } from "./libs/post";
import PostComponent from "./components/Post.vue";
import PageControl from "./components/PageControl.vue";

export default defineComponent({
    name: "App",
    components: {
        Post: PostComponent,
        PageControl,
    },
    setup() {
        const posts = ref<Post[]>([]);
        let previousPageStart: Array<string | null> = [];
        let cursor: string;
        const getFromParamFromUrl = () =>
            new URLSearchParams(location.search).get("from");
        const fetchPosts = async () => {
            const fromPost = getFromParamFromUrl();
            return fetch(
                `${import.meta.env.VITE_BACKEND_HOST}/api/posts${
                    fromPost ? "?from=" + fromPost : ""
                }`
            )
                .then((r) => r.json())
                .then((r: { cursor: string; posts: any[] }) => {
                    cursor = r.cursor;
                    posts.value = r.posts.map(
                        (p) => new Post(p.id, p.title, p.category)
                    );
                });
        };

        const changeUrl = (fromParam: string | null) =>
            history.pushState(
                null,
                "",
                `${location.origin}${location.pathname}${
                    fromParam ? "?from=" + fromParam : ""
                }`
            );
        const goToNextPage = () => {
            if (cursor === "0") return;
            previousPageStart.push(getFromParamFromUrl());
            changeUrl(cursor);
            fetchPosts();
        };
        const goToPreviousPage = () => {
            if (previousPageStart.length === 0) return;
            changeUrl(previousPageStart.pop() ?? null);
            fetchPosts();
        };
        onMounted(() => fetchPosts());

        return { posts, goToNextPage, goToPreviousPage };
    },
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
