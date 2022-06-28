import { createRouter, createWebHistory } from 'vue-router';

// regular
import Features from './pages/regular/Features.vue';
import ForgetPassword from './pages/regular/ForgetPassword.vue';
import Terms from './pages/regular/Terms.vue';
import Signup from './pages/regular/Signup.vue';
import Privacy from './pages/regular/Privacy.vue';
import Contact from './pages/regular/Contact.vue';
import Login from './pages/regular/Login.vue';
import RegularHome from './pages/regular/RegularHome.vue';
import RegularNotFound from './pages/regular/RegularNotFound.vue';

// dashboard
import DashboardHome from './pages/dashboard/DashboardHome.vue';
import DashboardNotFound from './pages/dashboard/DashboardNotFound.vue';
import Logs from './pages/dashboard/Logs.vue';
import Settings from './pages/dashboard/Settings.vue';
import Reports from './pages/dashboard/Reports.vue';
import Videos from './pages/dashboard/Videos.vue';

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
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      layout: 'RegularLayout',
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      layout: 'RegularLayout',
    },
  },
  {
    path: '/forget-password',
    name: 'Forget Password',
    component: ForgetPassword,
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
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      layout: 'RegularLayout',
    },
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
    meta: {
      layout: 'RegularLayout',
    },
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
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
    path: '/dashboard/profile',
    name: 'Dashboard',
    component: DashboardHome,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/logs',
    name: 'Logs',
    component: Logs,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/reports',
    name: 'Reports',
    component: Reports,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/videos',
    name: 'Videos',
    component: Videos,
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
