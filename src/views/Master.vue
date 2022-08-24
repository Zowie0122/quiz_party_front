<template>
  <div
    class="sx:min-w-fit flex min-h-fit max-w-2xl flex-col items-center justify-center space-y-4 px-2 py-4 md:space-y-8 md:px-4 md:py-8"
  >
    <template v-if="serverErr">
      <app-message :content="serverErr" />
      <app-button @btn_click="redirectToHome">Back</app-button>
    </template>

    <template v-else>
      <app-container>
        <div
          class="flex w-full flex-col items-center justify-center space-y-4 px-1 font-roboto text-white"
        >
          Copy game code and invite players
          <app-button
            size="small"
            class="!md:text-lg !text-xs focus:text-teal-500"
            @btn_click="handleClipboard"
            >{{ gameCode }}</app-button
          >
        </div>

        <div
          class="flex flex-col items-center justify-center space-y-2 p-2 md:space-y-4 md:p-4"
        >
          <div
            v-if="!isOngoing"
            class="flex w-full items-center justify-around"
          >
            <app-button @btn_click="handleChangeQMode('custom')" size="small"
              >Custom</app-button
            >
            <app-button @btn_click="handleChangeQMode('random')" size="small"
              >Random</app-button
            >
          </div>
          <div
            class="flex flex-row flex-wrap items-center justify-around space-y-2"
          >
            <app-input
              isTextarea
              :readonly="questionMode === 'random' || isOngoing"
              placeholder="Question goes here"
              v-model.trim="quiz.question"
              class="basis-full"
              size="small"
            />

            <labed-item
              v-for="(option, i) in quiz.options"
              :key="i"
              :label="alphaLabel[i]"
              :highlighted="quiz.bingo === i"
            >
              <div class="relative">
                <app-input
                  type="text"
                  :readonly="questionMode === 'random' || isOngoing"
                  placeholder="option"
                  v-model.trim="quiz.options[i]"
                  size="small"
                />

                <div
                  class="absolute inset-y-0 right-1 flex h-full items-center justify-center space-x-0.5 md:space-x-1"
                >
                  <icon-button
                    v-if="
                      i === this.quiz.options.length - 1 &&
                      quiz.options.length < maxOptions
                    "
                    @icon_click="handleAddOption"
                    class="transparent h-2/3 rounded-sm text-leaf"
                  >
                    <add-icon class="h-full"
                  /></icon-button>

                  <icon-button
                    @icon_click="handleDeleteOption"
                    class="transparent h-2/3 rounded-sm text-leaf"
                  >
                    <delete-icon class="h-full"
                  /></icon-button>
                </div>
              </div>
            </labed-item>

            <div
              v-if="!isOngoing"
              class="flex w-full flex-row items-center justify-center space-x-2 md:space-x-4"
            >
              <labed-item
                v-if="questionMode === 'custom'"
                label="Bingo"
                class="!space-x-1"
                :labelStyle="['!bg-white', '!text-leaf-dark', 'border-none']"
              >
                <select
                  v-model="quiz.bingo"
                  class="block w-16 rounded-lg border border-leaf bg-cloudy p-2 text-sm text-leaf-dark focus:ring-white"
                >
                  <option
                    v-for="(option, i) in quiz.options"
                    :key="i"
                    :value="i"
                  >
                    {{ alphaLabel[i] }}
                  </option>
                </select>
              </labed-item>

              <labed-item
                label="Timer"
                class="!space-x-1"
                :labelStyle="['!bg-white', '!text-leaf-dark', 'border-none']"
              >
                <select
                  v-model="timeLimit"
                  class="block w-16 rounded-lg border border-leaf bg-cloudy p-2 text-sm text-leaf-dark focus:ring-white"
                >
                  <option
                    v-for="(duration, i) in durations"
                    :key="i"
                    :value="duration"
                  >
                    {{ `${duration}s` }}
                  </option>
                </select>
              </labed-item>
            </div>
          </div>

          <div
            v-if="!isOngoing"
            class="flex w-full items-center justify-around"
          >
            <app-button
              :disabled="!!validationErr"
              @btn_click="handleStart"
              size="small"
              >Start</app-button
            >

            <app-button
              v-if="questionMode === 'custom'"
              @btn_click="handleResetQuiz"
              size="small"
              >Clear</app-button
            >
          </div>

          <Counter v-else :timeLeft="counter" />
        </div>
      </app-container>

      <app-container class="w-full">
        <Players :players="players" :bingo="quiz.bingo" />

        <div class="flex w-full items-center justify-around py-2">
          <app-button @btn_click="handleDisconnect" size="small"
            >Leave</app-button
          >

          <app-button
            :disabled="isOngoing || !hasDirtyWinCounts"
            @btn_click="handleResetGame"
            size="small"
            >Reset</app-button
          >
        </div>
      </app-container>
    </template>
  </div>
</template>

<script>
import io from 'socket.io-client';
import AddIcon from '../components/icons/Add.vue';
import DeleteIcon from '../components/icons/Delete.vue';
import AppMessage from '@/components/Message.vue';
import AppButton from '../components/Button.vue';
import AppInput from '@/components/Input.vue';
import LabedItem from '@/components/LabedItem.vue';
import Counter from '@/components/Counter.vue';
import Players from '@/components/Players.vue';
import IconButton from '@/components/buttons/IconButton.vue';
import AppContainer from '@/components/Container';

import { alphaLabel } from '../constants.js';
import {
  isValidUUID,
  isValidString,
  isInteger,
  isValidArrayOfStrings,
} from '../utils';

import { MAX_OPTIONS, DURATIONS } from '../quizConfig';
export default {
  name: 'Master',

  components: {
    AppContainer,
    AddIcon,
    DeleteIcon,
    AppMessage,
    AppButton,
    AppInput,
    LabedItem,
    Counter,
    Players,
    IconButton,
  },

  data: function () {
    return {
      socket: io('http://localhost:7000/'),
      alphaLabel,
      durations: DURATIONS,
      maxOptions: MAX_OPTIONS,
      players: [],
      questionMode: 'custom',
      quiz: {
        question: '',
        options: ['', ''],
        bingo: null,
      },
      timeLimit: 20,
      isOngoing: false,
      showBingo: false,
      counter: null,
      validationErr: 'Please make a question or go random',
      serverErr: '',
    };
  },

  beforeRouteEnter(to) {
    if (
      !to.params.gameCode ||
      !isValidUUID(to.params.gameCode) ||
      !to.params.mid ||
      !isValidUUID(to.params.mid)
    )
      return { name: 'Home' };
  },

  computed: {
    gameCode() {
      return this.$route.params.gameCode;
    },
    mid() {
      return this.$route.params.mid;
    },
    hasDirtyWinCounts() {
      return this.players.some((player) => player.winCounts !== 0);
    },
  },

  methods: {
    isValidArrayOfStrings,

    redirectToHome() {
      this.$router.push(`/`);
    },

    initializeQuiz() {
      this.quiz = {
        question: '',
        options: ['', ''],
        bingo: null,
      };
    },

    handleChangeQMode(mode) {
      this.questionMode = mode;

      if (mode === 'random') {
        this.socket.emit('get random quiz', {}, ({ quiz }) => {
          this.quiz = quiz;
        });
      }

      if (mode === 'custom') {
        this.initializeQuiz();
      }
    },

    handleAddOption() {
      this.quiz.options.push('');
    },

    handleDeleteOption(optionIndex) {
      this.quiz.options.splice(optionIndex - 1, 1);
      while (this.quiz.options.length < 2) {
        this.quiz.options.push('');
      }
    },

    handleClipboard() {
      navigator.clipboard.writeText(this.gameCode);
    },

    handleStart() {
      if (!this.timeLimit) this.timeLimit = 20;
      this.socket.emit('start quiz', {
        gameCode: this.gameCode,
        mid: this.mid,
        quiz: this.quiz,
        timeLimit: Number(this.timeLimit),
      });
    },

    handleResetQuiz() {
      this.initializeQuiz();
      this.timeLimit = 20;
      this.socket.emit('reset', {
        gameCode: this.gameCode,
        mid: this.mid,
        quiz: this.quiz,
      });
    },

    handleResetGame() {
      this.quiz = {
        question: null,
        options: ['', ''],
        bingo: null,
      };
      this.socket.emit('reset', {
        gameCode: this.gameCode,
        mid: this.mid,
        quiz: this.quiz,
        resetWinCounts: true,
      });
    },

    handleDisconnect() {
      this.socket.disconnect();
      this.$router.push(`/`);
    },
  },

  created() {
    this.socket.emit('join', { gameCode: this.gameCode, mid: this.mid });
  },

  mounted() {
    this.socket.on('updatedGame', ({ game }) => {
      const { players, showBingo, isOngoing } = game;
      this.players = players;

      this.showBingo = showBingo;
      if (showBingo) {
        this.timeLimit = null;
        this.counter = null;
      }

      this.isOngoing = isOngoing;
    });

    this.socket.on('counter', ({ timeleft }) => {
      this.counter = timeleft;
    });

    this.socket.on('error', ({ msg }) => {
      this.serverErr = msg;
    });
  },

  watch: {
    quiz: {
      handler(curr) {
        const { question, options, bingo } = curr;
        if (!isValidString(question)) {
          this.validationErr = 'Please make a question or go random';
        } else if (!isValidArrayOfStrings(options, 2)) {
          this.validationErr = 'Please provide more than two non empty options';
        } else if (!isInteger(bingo)) {
          this.validationErr = 'Please tab one option as the bingo';
        } else {
          this.validationErr = null;
        }
      },
      deep: true,
    },
  },
};
</script>
