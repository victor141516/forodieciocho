<template>
    <div class="flex pt-2 lg:pt-14">
        <div class="hidden lg:flex mx-auto px-4 pt-48">
            <ins id="938861" data-width="160" data-height="612"></ins>
        </div>
        <div
            class="
                flex-1 flex flex-col
                mx-1
                lg:mx-6
                3xl:mx-56
                select-none
                md:pb-8
                pb-2
            "
        >
            <a href="/"
                ><img class="mx-auto" alt="Logo" src="./assets/logo.png"
            /></a>
            <div class="hidden lg:flex mx-auto mt-4">
                <ins id="938856" data-width="728" data-height="102"></ins>
            </div>
            <div class="flex lg:hidden mx-auto mt-4">
                <ins id="938871" data-width="300" data-height="62"></ins>
            </div>

            <div class="mt-2 lg:mt-8">
                <div v-if="posts.length > 0">
                    <div class="flex items-center">
                        <PageControl
                            @next="goToNextPage"
                            @previous="goToPreviousPage"
                            :page="page"
                        ></PageControl>
                        <Search class="ml-4" @search="onSearch"></Search>
                        <div class="ml-auto flex md:mr-6">
                            <Limit
                                @changeLimit="onChangeLimit"
                                :currentLimit="currentLimitProp"
                            ></Limit>
                            <Order
                                @changeOrder="changeOrder"
                                :orderIcon="orderIcon"
                            ></Order>
                        </div>
                    </div>
                    <AdPost class="my-2 flex"></AdPost>
                    <Post
                        class="my-2 flex"
                        v-for="post in posts"
                        :key="post.id"
                        :post="post"
                    ></Post>
                    <PageControl
                        @next="goToNextPage"
                        @previous="goToPreviousPage"
                        :page="page"
                    ></PageControl>
                </div>
                <div v-else>
                    <p>LOADING...</p>
                </div>
            </div>

            <div class="hidden lg:flex mx-auto mt-8 h-52">
                <iframe
                    style="width: 50rem"
                    src="https://chaturbate.com/in/?track=default&tour=x1Rd&campaign=Y8Nm5&c=4&p=0&gender=x"
                ></iframe>
            </div>
            <div class="flex lg:hidden mx-auto mt-4">
                <ins id="938872" data-width="300" data-height="62"></ins>
            </div>
        </div>
        <div class="hidden lg:flex mx-auto px-4 pt-48">
            <ins id="938864" data-width="160" data-height="612"></ins>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import { Post, PostCategory } from "./libs/post";
import AdPost from "./components/AdPost.vue";
import Limit from "./components/Limit.vue";
import Order from "./components/Order.vue";
import PostComponent from "./components/Post.vue";
import PageControl from "./components/PageControl.vue";
import Search from "./components/Search.vue";

const getUrlParam = (param: string) =>
    new URLSearchParams(location.search).get(param);

export default defineComponent({
    name: "App",
    components: {
        AdPost,
        Limit,
        Order,
        Post: PostComponent,
        PageControl,
        Search,
    },
    setup() {
        const posts = ref<Post[]>(
            new Array(import.meta.env.PROD ? 0 : 10).fill(
                new Post("0", "a", PostCategory["+18"], new Date(), new Date())
            )
        );
        const getLimit = () => Number.parseInt(getUrlParam("limit") ?? "10");
        const getPageNumber = () =>
            Number.parseInt(getUrlParam("from") ?? "0") / getLimit();
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
            params.set("limit", getLimit().toString());

            return fetch(
                `${
                    import.meta.env.VITE_BACKEND_HOST
                }/api/posts?${params.toString()}`
            )
                .then((r) => r.json())
                .then((r: { cursor: string; posts: any[] }) => {
                    if (r.posts.length === getLimit()) {
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
            nextCursor = Math.max(0, nextCursor - getLimit() * 2);
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

        if (import.meta.env.PROD) onMounted(() => fetchPosts());

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

        const currentLimitProp = ref(getLimit());
        const onChangeLimit = (newLimit: number) => {
            currentLimitProp.value = newLimit;
            changeUrl({ limit: newLimit });
            fetchPosts();
        };

        return {
            posts,
            page,
            goToNextPage,
            goToPreviousPage,
            onSearch,
            changeOrder,
            orderIcon,
            currentLimitProp,
            onChangeLimit,
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
}
</style>
