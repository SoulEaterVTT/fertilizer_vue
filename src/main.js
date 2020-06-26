import Vue from "vue";
import App from "./App";
import router from "./router";
import VueSession from "vue-session";
import ElementUI from "element-ui";
import "@/icons";
import store from "./store/index";
import("element-ui/lib/theme-chalk/index.css");
import "@/style/index.scss";

Vue.use(VueSession);
Vue.use(ElementUI, { size: "middle" });
Vue.config.productionTip = false;
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
