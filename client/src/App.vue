<template>
    <div class="xl:w-1/2 md:w-3/4 md:mx-auto sm:mx-2 select-none">
        <img class="mx-auto" alt="Logo" src="./assets/logo.png" />
        <div class="mt-12">
            <div v-if="posts.length > 0">
                <div class="flex items-center">
                    <PageControl
                        @next="goToNextPage"
                        @previous="goToPreviousPage"
                        :page="page"
                    ></PageControl>
                    <Search class="ml-4" @search="onSearch"></Search>
                    <div
                        class="ml-auto mr-6 w-8 h-8 text-xl bg-red-400 hover:bg-red-600 border-2 border-red-600 flex items-center justify-center cursor-pointer"
                        @click="changeOrder"
                    >
                        <span>{{ orderIcon }}</span>
                    </div>
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

const getUrlParam = (param: string) =>
    new URLSearchParams(location.search).get(param);

export default defineComponent({
    name: "App",
    components: {
        Post: PostComponent,
        PageControl,
        Search,
    },
    setup() {
        const posts = ref<Post[]>([]);
        const limit = 10;
        const getPageNumber = () =>
            Number.parseInt(getUrlParam("from") ?? "0") / limit;
        const page = ref(getPageNumber());
        let nextCursor: number;
        let hasNextPage = true;
        let isFetchingData = false;

        const fetchPosts = async () => {
            if (isFetchingData) return;
            isFetchingData = true;
            const params = new URLSearchParams();

            if (getUrlParam("from")) params.set("from", getUrlParam("from")!);
            if (getUrlParam("search"))
                params.set("search", getUrlParam("search")!);
            if (getUrlParam("order"))
                params.set("order", getUrlParam("order")!);

            return fetch(
                `${
                    import.meta.env.VITE_BACKEND_HOST
                }/api/posts?${params.toString()}`
            )
                .then((r) => r.json())
                .then((r: { cursor: string; posts: any[] }) => {
                    if (r.posts.length === limit) {
                        nextCursor = Number.parseInt(r.cursor);
                    }
                    hasNextPage = r.posts.length !== 0;
                    if (hasNextPage) {
                        posts.value = r.posts.map(
                            (p) =>
                                new Post(
                                    p.id,
                                    p.title,
                                    p.category,
                                    new Date(p.createdAt),
                                    new Date(p.updatedAt)
                                )
                        );
                    }
                    isFetchingData = false;
                });
        };

        const changeUrl = (
            params: Record<string, string | number | undefined>
        ) => {
            const query = new URLSearchParams(location.search);
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
            page.value = getPageNumber();
        };
        const goToNextPage = () => {
            if (!hasNextPage) return;
            changeUrl({ from: nextCursor });
            fetchPosts();
        };
        const goToPreviousPage = () => {
            if (nextCursor === 0) return;
            nextCursor = Math.max(0, nextCursor - limit * 2);
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

        const getOrderIcon = () =>
            (getUrlParam("order") ?? "a") === "a" ? "👇" : "☝️";
        const orderIcon = ref(getOrderIcon());
        const changeOrder = () => {
            changeUrl({
                order: { a: "d", d: "a" }[getUrlParam("order") ?? "a"],
            });
            fetchPosts();
            orderIcon.value = getOrderIcon();
        };

        return {
            posts,
            page,
            goToNextPage,
            goToPreviousPage,
            onSearch,
            changeOrder,
            orderIcon,
        };
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
