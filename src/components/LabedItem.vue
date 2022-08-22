<template>
  <div class="flex flex-row items-center justify-center space-x-2">
    <button
      class="flex-none rounded-lg bg-pink-600 p-2 text-center text-sm font-medium text-white md:p-4 md:text-xl"
      :class="[
        `${highlighted && `bg-yellow-300`} `,
        `${selected && `bg-sky-300`} `,
      ]"
      @click="$emit('label_click')"
      :disabled="disabled"
    >
      {{ label }}
    </button>

    <slot class="px-2 py-1 md:px-4 md:py-2"></slot>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
      required: true,
    },

    highlighted: {
      type: Boolean,
      default: false,
      required: false,
    },

    selected: {
      type: Boolean,
      default: false,
      required: false,
    },

    disabled: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
};
</script>
