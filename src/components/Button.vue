<template>
  <button
    type="button"
    class="inline-flex items-center rounded-lg border border-gray-200 bg-white text-center text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100"
    :class="[...sizeClass, `${disabled && 'text-gray-300'} `]"
    @click="$emit('btn_click')"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    size: {
      type: String,
      default: 'medium',
      required: false,
    },
  },

  computed: {
    sizeClass() {
      if (this.size === 'small') {
        return ['text-sm', 'px-4', 'py-2', 'font-medium'];
      } else if (this.size === 'large') {
        return [
          '!px-16',
          '!py-8',
          '!md:px-32',
          '!md:py-16',
          '!text-2xl',
          '!md:text-3xl',
          '!font-bold',
        ];
      } else {
        return [
          '!px-8',
          '!py-4',
          '!md:px-16',
          '!md:py-8',
          '!text-xl',
          '!md:text-2xl',
          '!font-bold',
        ];
      }
    },
  },
};
</script>
