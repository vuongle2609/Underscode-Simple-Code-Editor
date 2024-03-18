import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { install as VueMonacoEditorPlugin } from "@guolao/vue-monaco-editor";
import App from "./App.vue";
import router from "./router";
import path from "path";

const app = createApp(App);

// const configFile = path.join(path.dirname(__dirname), "extraResources", "vs");

const configFile = path.join(process.env.VITE_PUBLIC, "vs")
console.log("🚀 ~ configFile:", configFile);

app.use(createPinia());
app.use(router);
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: configFile,
  },
});

app.mount("#app");
