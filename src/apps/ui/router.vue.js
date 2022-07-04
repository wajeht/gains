import { createRouter, createWebHistory } from 'vue-router';

// regular
import Features from './pages/regular/Features.vue';
import ForgetPassword from './pages/regular/ForgetPassword.vue';
import Terms from './pages/regular/Terms.vue';
import Privacy from './pages/regular/Privacy.vue';
import RegularContact from './pages/regular/RegularContact.vue';
import RegularHome from './pages/regular/RegularHome.vue';
import RegularLogin from './pages/regular/RegularLogin.vue';
import RegularSignup from './pages/regular/RegularSignup.vue';
import RegularNotFound from './pages/regular/RegularNotFound.vue';

// dashboard
import Profile from './pages/dashboard/Profile.vue';
import DashboardLogin from './pages/dashboard/DashboardLogin.vue';
import DashboardSignup from './pages/dashboard/DashboardSignup.vue';
import DashboardNotFound from './pages/dashboard/DashboardNotFound.vue';
import Sessions from './pages/dashboard/Sessions.vue';
import SessionDetails from './components/dashboard/SessionDetails.vue';
import DashboardContact from './pages/dashboard/DashboardContact.vue';
import Settings from './pages/dashboard/Settings.vue';
import Videos from './pages/dashboard/Videos.vue';
import VideoDetails from './components/dashboard/VideoDetails.vue';

// resources
import Tools from './pages/dashboard/tools/Tools.vue';
import OneRepMaxCalculator from './pages/dashboard/tools/calculators/OneRepMaxCalculator.vue.vue';
import AttemptSelectionCalculator from './pages/dashboard/tools/calculators/AttemptSelectionCalculator.vue';
import RPECalculator from './pages/dashboard/tools/calculators/RPECalculator.vue';
import PlateCalculator from './pages/dashboard/tools/calculators/PlateCalculator.vue';

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
    component: RegularLogin,
    meta: {
      layout: 'RegularLayout',
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: RegularSignup,
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
    component: RegularContact,
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
    path: '/dashboard/login',
    name: 'DashboardLogin',
    component: DashboardLogin,
    meta: {
      layout: 'EmptyDashboardLayout',
    },
  },
  {
    path: '/dashboard/signup',
    name: 'DashboardSignup',
    component: DashboardSignup,
    meta: {
      layout: 'EmptyDashboardLayout',
    },
  },
  {
    path: '/dashboard/settings/contact',
    name: 'DashboardContact',
    component: DashboardContact,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/sessions',
    name: 'Sessions',
    component: Sessions,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  // Tools
  {
    path: '/dashboard/tools',
    name: 'Tools',
    component: Tools,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  // 1rm
  {
    path: '/dashboard/tools/calculators/one-rep-max-calculator',
    name: 'OneRepMaxCalculator',
    component: OneRepMaxCalculator,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  // rpe
  {
    path: '/dashboard/tools/calculators/rpe-calculator',
    name: 'RPECalculator',
    component: RPECalculator,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  // plate
  {
    path: '/dashboard/tools/calculators/plate-calculator',
    name: 'PlateCalculator',
    component: PlateCalculator,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  // attempt
  {
    path: '/dashboard/tools/calculators/attempt-selection-calculator',
    name: 'AttemptSelectionCalculator',
    component: AttemptSelectionCalculator,
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
    path: '/dashboard/videos/:id',
    name: 'VideoDetails',
    component: VideoDetails,
    props: true,
    meta: {
      layout: 'DashboardLayout',
    },
  },

  {
    path: '/dashboard/sessions/:id',
    name: 'SessionDetails',
    component: SessionDetails,
    props: true,
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
