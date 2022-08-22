<template>
  <div class="flex flex-col items-center justify-center space-y-4">
    <template v-if="serverErr">
      <app-message :content="serverErr" />
      <app-button @btn_click="redirectToHome">Back</app-button>
    </template>

    <template v-else>
      <app-message :content="`${master} is hosting`" class="animate-pulse" />

      <quiz-container v-if="quiz.question">
        <app-message :content="quiz.question" />
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
        <Counter v-if="isOngoing" :timeLeft="counter" />
      </quiz-container>

      <Players :players="players" :bingo="quiz.bingo" />
    </template>

    <app-button
      @btn_click="handleDisconnect"
      class="self-end justify-self-end"
      size="small"
      >Leave</app-button
    >
  </div>
</template>

<script>
import io from 'socket.io-client';

import AppMessage from '@/components/Message.vue';
import AppButton from '../components/Button.vue';
import AppInput from '@/components/Input.vue';
import LabedItem from '@/components/LabedItem.vue';
import Counter from '@/components/Counter.vue';
import QuizContainer from '@/components/QuizContainer.vue';
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
    QuizContainer,
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
