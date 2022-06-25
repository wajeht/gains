import { createRouter, createWebHistory } from 'vue-router';

// regular
import Features from './pages/regular/Features.vue';
import RegularHome from './pages/regular/RegularHome.vue';
import RegularNotFound from './pages/regular/RegularNotFound.vue';

// dashboard
import DashboardHome from './pages/dashboard/DashboardHome.vue';
import DashboardNotFound from './pages/dashboard/DashboardNotFound.vue';

const routes = [
  // regular
  {
    path: '/',
    name: 'Home',
    component: RegularHome,
    meta: {
      layout: 'RegularLayout',
    },
  },
  {
    path: '/features',
    name: 'Features',
    component: Features,
    meta: {
      layout: 'RegularLayout',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: RegularNotFound,
    meta: {
      layout: 'RegularLayout',
    },
  },
  // dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardHome,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: DashboardNotFound,
    meta: {
      layout: 'DashboardLayout',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
});

export default router;
