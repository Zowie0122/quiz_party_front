<template>
  <div class="flex flex-row items-stretch justify-center space-x-2">
    <button
      class="flex-none rounded-lg border border-cherry bg-sakura p-2 text-center text-sm font-medium text-leaf-dark md:border-2 md:text-xl"
      :class="[
        `${highlighted && `bg-yellow-300`} `,
        `${selected && `bg-sky-300`} `,
        ...labelStyle,
      ]"
      @click="$emit('label_click')"
      :disabled="disabled"
    >
      {{ label }}
    </button>

    <slot class="h-full"></slot>
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

    labelStyle: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
};
</script>
