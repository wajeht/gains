import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';

import useUserStore from './store/user.store.js';
import routes from './router.vue.js';

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
import VueLazyload from '@jambonn/vue-lazyload';

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

app.use(autoAnimatePlugin);
app.directive('tooltip', tooltip);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(VueLazyload, {
  lazyComponent: true,
  preLoad: 1.3,
  attempt: 1,
});

// --- init auth state on app starts --
const userStore = useUserStore();
userStore.checkAuthentication();
// --- init auth state on app ends --

app.use(routes);
app.mount('#app');
