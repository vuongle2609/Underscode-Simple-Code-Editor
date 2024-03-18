import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { install as VueMonacoEditorPlugin } from "@guolao/vue-monaco-editor";
import App from "./App.vue";
import router from "./router";
import path from "path";
const app = createApp(App);
import * as monaco from "monaco-editor";

// const configFile = path.join(path.dirname(__dirname), "extraResources", "vs");

const configFile = path.join(path.join(__dirname, "../dist"), "vs");

app.use(createPinia());
app.use(router);
// app.use(VueMonacoEditorPlugin, {
//   monaco,
//   // paths: {
//   //   // vs: 'extraResources/vs',
//   //   vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs",
//   // },
// });

app.mount("#app");
