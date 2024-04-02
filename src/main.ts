import { install as VueMonacoEditorPlugin } from "@guolao/vue-monaco-editor";
import "file-icons-js/css/style.css";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { createPinia } from "pinia";
import { createApp } from "vue";
import VueResizable from 'vue-resizable'
import PerfectScrollbar from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PerfectScrollbar);
app.use(VueMonacoEditorPlugin, {
  monaco,
});
app.use(Toast, {
  position: "bottom-right",
});
app.component("vue-resizable", VueResizable)

app.mount("#app");
