import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';

import useUserStore from './store/user.store.js';
import routes from './router.vue.js';

import { VueQueryPlugin } from 'vue-query';

// external
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import tooltip from './tool-tip.vue.js';
import FontAwesomeIcon from './font-awesome.vue.js';
import { Chart, registerables } from 'chart.js';
import useAppStore from './store/app.store.js';

const app = createApp(App);
const pinia = createPinia(piniaPluginPersistedstate);
pinia.use(({ store }) => {
  store.router = markRaw(routes);
});
app.use(pinia);
pinia.use(piniaPluginPersistedstate);

Chart.register(...registerables);

app.config.performance = true;
app.config.devtools = true;

app.use(VueQueryPlugin);
app.use(autoAnimatePlugin);
app.directive('tooltip', tooltip);
app.component('font-awesome-icon', FontAwesomeIcon);

// --- change theme

const appStore = useAppStore();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  const theme = event.matches ? 'dark' : 'light';
  if (theme === 'dark') {
    appStore.darkMode = true;
  } else {
    appStore.darkMode = false;
  }
});

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  appStore.darkMode = true;
} else {
  appStore.darkMode = false;
}

if (appStore.darkMode === false) {
  document.body.classList.remove('dark-mode');
} else {
  document.body.classList.add('dark-mode');
}
// --- change theme

// --- init auth state on app starts --
const userStore = useUserStore();
userStore.checkAuthentication();
// --- init auth state on app ends --

app.use(routes);
app.mount('#app');
