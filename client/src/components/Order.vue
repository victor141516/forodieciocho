<template>
  <div
    class="w-8 h-8 text-xl bg-red-400 hover:bg-red-600 border-2 border-red-600 flex items-center justify-center cursor-pointer"
    @click="$emit('changeOrder')"
  >
    <span>{{ orderIcon }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Order',
  emits: ['changeOrder'],
  props: {
    orderIcon: {
      type: String,
      required: true,
    },
  },
})
</script>
