<template>
  <button
    class="focus:shadow-outline p-0.5 focus:outline-none"
    @click="$emit('icon_click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {};
</script>
