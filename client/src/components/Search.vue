<template>
  <div class="flex flex-col">
    <form class="flex items-center" @submit.prevent="$emit('search', searchTerm)" action="">
      <div class="border-2 border-red-600 max-w-max">
        <input
          v-model="searchTerm"
          type="text"
          class="w-full outline-none px-2 py-1 bg-red-400 text-gray-800"
          placeholder="🔍🔎🔍🔎"
        />
      </div>
      <button type="submit" class="ml-2 bg-red-400 hover:bg-red-600 border-2 border-red-600">🔍</button>
    </form>
    <div class="mt-2 flex text-xs">
      <span
        @click="$emit('search', shortcurt)"
        v-for="shortcurt in shortcurs"
        :key="shortcurt"
        class="bg-red-400 hover:bg-red-600 border-2 border-red-600 cursor-pointer mr-1"
      >
        {{ shortcurt }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineEmits<{ (e: 'search', term: string): void }>()
const props = defineProps<{ initTerm: string }>()
const searchTerm = ref(props.initTerm)
const shortcurs = ref(['+18', '+16', '+14', '+hd', '+prv'])
</script>
