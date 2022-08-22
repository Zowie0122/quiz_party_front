<template>
  <div
    class="min-w-screen flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-500 to-sky-300 px-2 py-4 font-sans md:px-8 md:py-4"
  >
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
