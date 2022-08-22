<template>
  <div
    class="max-w-sm break-words rounded-lg border border-gray-200 bg-white px-6 py-3 text-center shadow-md md:p-12 md:py-6"
  >
    <p class="text-base text-gray-700 md:text-lg">{{ content }}</p>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '',
      required: true,
    },
  },
};
</script>
