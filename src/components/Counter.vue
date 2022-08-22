<template>
  <div
    v-if="timeLeft"
    class="animate-bounce p-2 text-3xl font-bold text-white md:p-4"
  >
    {{ timeLeft }}
  </div>
</template>

<script>
export default {
  props: {
    timeLeft: {
      type: [Number, null],
      required: true,
    },
  },
};
</script>
