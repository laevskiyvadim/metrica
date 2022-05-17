import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/:aaa/:bbb/:ccc/:ddd",
    component: () => import("../views/App.vue"),
  },
  {
    path: "/:aaa/:bbb/:ccc",
    component: () => import("../views/App.vue"),
  },
  {
    path: "/:aaa/:bbb",
    component: () => import("../views/App.vue"),
  },
];

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
