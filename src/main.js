import { createApp, defineAsyncComponent } from "vue";
const App = defineAsyncComponent(() => import("@/views/App.vue"));
import router from "./router/index";
import { store } from "./store/index";

createApp(App).use(router).use(store).mount("#app");
