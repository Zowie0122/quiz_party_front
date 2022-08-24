<template>
  <div
    v-if="players.length > 0"
    class="items-around flex flex-wrap items-center justify-center gap-2 space-x-2 md:space-x-4"
  >
    <div
      v-for="(player, i) in players"
      :key="i"
      class="grid grid-flow-col grid-rows-1 content-center rounded-lg border border-cherry bg-white text-cherry shadow-lg"
    >
      <div
        class="col-span-2 flex items-center justify-center break-all p-2 text-sm font-medium md:text-lg"
        :class="[`${bingo && player.answer === bingo && 'animate-pulse'} `]"
      >
        {{ player.name }}
      </div>
      <div
        class="col-span-2 row-span-2 flex items-center justify-center rounded-bl-lg font-bold text-leaf-dark/80 md:text-lg"
        :class="getPlayerColor(i)"
      >
        {{ alphaLabel[player.answer] }}
      </div>

      <div
        class="row-span-3 flex w-10 items-center justify-center rounded-r-lg text-xl font-bold text-leaf-dark/80 md:text-2xl"
        :class="getPlayerColor(i)"
      >
        {{ player.winCounts }}
      </div>
    </div>
  </div>
</template>

<script>
import { alphaLabel, tailwindColors } from '../constants';
export default {
  data: function () {
    return {
      alphaLabel,
    };
  },
  props: {
    players: {
      type: Array,
      required: true,
    },
    bingo: {
      type: [Number, null],
      required: false,
    },
  },

  methods: {
    getPlayerColor(i) {
      return tailwindColors[
        i > tailwindColors.length - 1
          ? Math.round(i / tailwindColors.length)
          : i
      ];
    },
  },
};
</script>
