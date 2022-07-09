import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import routes from './router.vue.js';

// external
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';
import 'animate.css';
import 'hover.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FontAwesomeIcon from './font-awesome.vue.js';
import tooltip from './tool-tip.vue.js';
import { Chart, registerables } from 'chart.js';

import VueAnimXyz from '@animxyz/vue3';
import '@animxyz/core';

AOS.init();

const app = createApp(App);

Chart.register(...registerables);
app.component('font-awesome-icon', FontAwesomeIcon);

app.config.performance = true;
app.config.devtools = true;

app.directive('tooltip', tooltip);

app.use(createPinia());
app.use(VueAnimXyz);
app.use(routes);

app.mount('#app');
