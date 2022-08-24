<template>
  <textarea
    v-if="isTextarea"
    v-bind="$attrs"
    type="text"
    :readonly="readonly"
    :rows="rows"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="style"
  />

  <input
    v-else
    v-bind="$attrs"
    :readonly="readonly"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="style"
  />
</template>

<script>
export default {
  props: {
    isTextarea: {
      type: Boolean,
      default: false,
      required: false,
    },

    rows: {
      type: Number,
      default: 2,
      required: false,
    },

    readonly: {
      type: Boolean,
      default: false,
      required: false,
    },

    placeholder: {
      type: String,
      default: '',
      required: false,
    },

    modelValue: {
      type: [String, Number],
      default: '',
      required: true,
    },

    size: {
      type: String,
      default: 'medium',
      required: false,
    },
  },

  computed: {
    style() {
      const commonClass = [
        'inline-flex',
        'rounded-lg',
        'border',
        'border-leaf',
        'bg-cloudy/30',
        'text-leaf-dark',
        'focus:border-white',
        'focus:ring-white',
        'font-roboto',
      ];
      if (this.size === 'small') {
        return commonClass.concat([
          'px-4',
          'py-2',
          'md:px-8',
          'md:py-4',
          'font-base',
        ]);
      } else if (this.size === 'large') {
        return commonClass.concat([
          'px-16',
          'py-8',
          'md:px-32',
          'md:py-16',
          'text-xl',
          'md:text-2xl',
          'font-bold',
        ]);
      } else {
        return commonClass.concat([
          'px-6',
          'py-3',
          'md:px-12',
          'md:py-6',
          'text-lg',
          'md:text-xl',
          'font-medium',
        ]);
      }
    },
  },
};
</script>
