import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify.js";
import { loadFonts } from "./plugins/webfontloader.js";
import router from "./router/index.js";

loadFonts();

createApp(App).use(vuetify).use(router).mount("#app");
