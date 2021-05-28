<template>
    <div class="2xl:w-2/5 xl:w-1/2 md:w-3/4 md:mx-auto sm:mx-2">
        <img class="mx-auto" alt="Logo" src="./assets/logo.png" />
        <div class="mt-12">
            <div v-if="posts.length > 0">
                <div class="flex items-center">
                    <PageControl
                        @next="goToNextPage"
                        @previous="goToPreviousPage"
                    ></PageControl>
                    <Search class="ml-4" @search="onSearch"></Search>
                </div>
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
import Search from "./components/Search.vue";

export default defineComponent({
    name: "App",
    components: {
        Post: PostComponent,
        PageControl,
        Search,
    },
    setup() {
        const posts = ref<Post[]>([]);
        let nextCursor: number;
        let hasNextPage = true;
        let isFetchingData = false;
        const getUrlParam = (param: string) =>
            new URLSearchParams(location.search).get(param);

        const fetchPosts = async () => {
            if (isFetchingData) return;
            isFetchingData = true;
            const params = new URLSearchParams();

            if (getUrlParam("from")) params.set("from", getUrlParam("from")!);
            if (getUrlParam("search"))
                params.set("search", getUrlParam("search")!);

            return fetch(
                `${
                    import.meta.env.VITE_BACKEND_HOST
                }/api/posts?${params.toString()}`
            )
                .then((r) => r.json())
                .then((r: { cursor: string; posts: any[] }) => {
                    nextCursor = Number.parseInt(r.cursor);
                    hasNextPage = r.posts.length !== 0;
                    if (hasNextPage) {
                        posts.value = r.posts.map(
                            (p) => new Post(p.id, p.title, p.category)
                        );
                    }
                    isFetchingData = false;
                });
        };

        const changeUrl = (
            params: Record<string, string | number | undefined>
        ) => {
            const query = new URLSearchParams();
            Object.keys(params).forEach((k) => {
                if (params[k] !== undefined)
                    query.set(k, params[k]!.toString());
                else query.delete(k);
            });
            history.pushState(
                null,
                "",
                `${location.origin}${location.pathname}?${query.toString()}`
            );
        };
        const goToNextPage = () => {
            if (!hasNextPage) return;
            changeUrl({ from: nextCursor });
            fetchPosts();
        };
        const goToPreviousPage = () => {
            if (nextCursor === 0) return;
            nextCursor = Math.max(0, nextCursor - posts.value.length * 2);
            changeUrl({ from: nextCursor });
            fetchPosts();
        };

        window.addEventListener("popstate", () => fetchPosts());

        const onSearch = (term: string) => {
            nextCursor = 0;
            changeUrl({
                from: undefined,
                search: term === "" ? undefined : term,
            });
            fetchPosts();
        };
        onMounted(() => fetchPosts());

        return { posts, goToNextPage, goToPreviousPage, onSearch };
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
