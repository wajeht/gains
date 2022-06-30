import { createApp } from 'vue';
import App from './App.vue';

import routes from './router.vue.js';

// external
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';
import 'animate.css';
import 'hover.css';
import FontAwesomeIcon from './font-awesome';
import { Chart, registerables } from 'chart.js';

const app = createApp(App);

Chart.register(...registerables);
app.component('font-awesome-icon', FontAwesomeIcon);

app.config.performance = true;
app.config.devtools = true;

app.use(routes);

app.mount('#app');
