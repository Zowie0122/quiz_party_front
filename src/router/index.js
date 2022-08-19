import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Master from "../views/Master.vue";
import Player from "../views/Player.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/game/:gameCode/master/:mid",
    name: "Master",
    component: Master,
  },
  {
    path: "/game/:gameCode/player/:name",
    name: "Player",
    component: Player,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
