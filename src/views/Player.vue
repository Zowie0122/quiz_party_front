<template>
  <div
    class="sx:min-w-fit flex min-h-fit max-w-2xl flex-col items-center justify-center space-y-4 px-2 py-4 md:space-y-8 md:px-4 md:py-8"
  >
    <template v-if="serverErr">
      <app-message :content="serverErr" />
      <app-button @btn_click="redirectToHome">Back</app-button>
    </template>

    <template v-else>
      <app-message :content="`${master} is hosting`" class="animate-pulse" />

      <app-container v-if="quiz.question" class="!divide-none p-2 md:p-4">
        <app-message :content="quiz.question" />

        <div
          class="flex flex-row flex-wrap items-center justify-around space-y-2"
        >
          <labed-item
            v-for="(option, i) in quiz.options"
            :key="i"
            :label="alphaLabel[i]"
            @label_click="handleSelect(i)"
            :highlighted="quiz.bingo === i"
            :selected="answer === i"
            :disabled="showBingo"
          >
            <div class="flex-1">
              <app-input
                type="text"
                readonly
                v-model.trim="quiz.options[i]"
                size="small"
              />
            </div>
          </labed-item>
        </div>
        <Counter v-if="isOngoing" :timeLeft="counter" />
      </app-container>

      <app-container class="w-full">
        <Players
          :players="players"
          :bingo="quiz.bingo"
          class="p-1 md:px-4 md:py-2"
        />

        <div class="flex w-full items-center justify-center p-4">
          <app-button @btn_click="handleDisconnect" size="small"
            >Leave</app-button
          >
        </div>
      </app-container>
    </template>
  </div>
</template>

<script>
import io from 'socket.io-client';

import AppMessage from '@/components/Message.vue';
import AppButton from '../components/Button.vue';
import AppInput from '@/components/Input.vue';
import LabedItem from '@/components/LabedItem.vue';
import Counter from '@/components/Counter.vue';
import AppContainer from '@/components/Container';
import Players from '@/components/Players.vue';

import { alphaLabel } from '../constants.js';
import { isValidUUID, isValidString } from '../utils';

export default {
  name: 'Player',

  components: {
    AppMessage,
    AppButton,
    AppInput,
    LabedItem,
    Counter,
    AppContainer,
    Players,
  },

  data: function () {
    return {
      socket: io('http://localhost:7000/'),
      alphaLabel,
      master: null,
      players: [],
      quiz: {
        question: null,
        options: [],
        bingo: null,
      },
      answer: null,
      isOngoing: false,
      showBingo: false,
      counter: null,
      serverErr: null,
    };
  },

  beforeRouteEnter(to) {
    if (
      !to.params.gameCode ||
      !isValidUUID(to.params.gameCode) ||
      !to.params.name ||
      !isValidString(to.params.name)
    )
      return { name: 'Home' };
  },

  computed: {
    gameCode() {
      return this.$route.params.gameCode;
    },

    name() {
      return this.$route.params.name;
    },
  },

  methods: {
    redirectToHome() {
      this.$router.push(`/`);
    },

    handleSelect(answer) {
      this.answer = answer;
      this.socket.emit('select', {
        gameCode: this.gameCode,
        answer: answer,
      });
    },

    handleDisconnect() {
      this.socket.disconnect();
      this.$router.push(`/`);
    },
  },

  created() {
    this.socket.emit('join', { gameCode: this.gameCode, name: this.name });
  },

  mounted() {
    this.socket.on('updatedGame', ({ game }) => {
      const { master, players, quiz, isOngoing, showBingo } = game;
      this.master = master.name;
      this.players = players;

      this.quiz = quiz;
      this.isOngoing = isOngoing;
      this.showBingo = showBingo;

      if (showBingo) this.answer = null;
    });

    this.socket.on('counter', ({ timeleft }) => {
      this.counter = timeleft;
    });

    this.socket.on('master left', ({ msg }) => {
      this.serverErr = msg;
    });

    this.socket.on('error', ({ msg }) => {
      this.serverErr = msg;
    });
  },
};
</script>
