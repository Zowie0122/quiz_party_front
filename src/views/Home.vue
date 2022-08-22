<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center space-y-8 px-2 md:px-6"
  >
    <template v-if="!mode">
      <app-button size="large" @btn_click="setMode('new')">New game</app-button>
      <div
        class="px-16 py-8 text-2xl font-bold uppercase md:px-32 md:py-16 md:text-3xl"
      >
        Or
      </div>
      <app-button size="large" @btn_click="setMode('join')"
        >Join game</app-button
      >
    </template>

    <template v-else>
      <app-input type="text" placeholder="Your name" v-model.trim="name" />
      <app-button
        v-if="mode === 'new'"
        @btn_click="newGameHandler"
        :disabled="!name"
        >Start</app-button
      >
      <app-input
        v-if="mode === 'join'"
        isTextarea
        placeholder="Invitation code"
        v-model.trim="gameCode"
      />
      <app-button
        v-if="mode === 'join'"
        @btn_click="joinGameHandler"
        :disabled="!name || !gameCode"
        >join</app-button
      >
    </template>
  </div>
</template>

<script>
import AppButton from '../components/Button.vue';
import AppInput from '@/components/Input.vue';

export default {
  name: 'Home',

  components: {
    AppButton,
    AppInput,
  },

  data: function () {
    return {
      mode: null,
      name: '',
      gameCode: '',
    };
  },

  methods: {
    setMode(mode) {
      this.mode = mode;
    },

    newGameHandler: function () {
      fetch('http://localhost:7000/new', {
        method: 'POST',
        referrerPolicy: 'no-referrer',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        redirect: 'follow',
        body: JSON.stringify({
          name: this.name,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const { gameCode, mid } = data;
          if (gameCode && mid)
            this.$router.push(`/game/${gameCode}/master/${mid}`);
        })
        .catch((err) => console.log(err));
    },

    joinGameHandler: function () {
      this.$router.push(`/game/${this.gameCode}/player/${this.name}`);
    },
  },
};
</script>
