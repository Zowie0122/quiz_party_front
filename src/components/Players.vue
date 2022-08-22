<template>
  <div v-if="players.length > 0" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <div
      v-for="(player, i) in players"
      :key="i"
      class="flex items-center justify-start rounded-lg bg-black/20 px-2 py-1 text-white shadow-lg"
    >
      <div
        class="mr-2 flex h-10 w-10 flex-none items-center justify-center rounded-lg text-xl font-bold md:text-2xl"
        :class="getPlayerColor(i)"
      >
        {{ alphaLabel[player.answer] }}
      </div>

      <div class="flex flex-col space-y-1">
        <div
          class="break-all text-sm font-medium md:text-lg"
          :class="[`${bingo && player.answer === bingo && 'animate-pulse'} `]"
        >
          {{ player.name }}
        </div>
        <div class="font-bold md:text-lg">{{ player.winCounts }}</div>
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
      return ['bg-gradient-to-br'].concat(
        tailwindColors[
          i > tailwindColors.length - 1
            ? Math.round(i / tailwindColors.length)
            : i
        ]
      );
    },
  },
};
</script>
