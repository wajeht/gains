import { createRouter, createWebHistory } from 'vue-router';

// -------------------- regular ---------------------------
import Features from './pages/regular/Features.vue';
import ForgetPassword from './pages/regular/ForgetPassword.vue';
import RegularTerms from './pages/regular/RegularTerms.vue';
import RegularPrivacy from './pages/regular/RegularPrivacy.vue';
import RegularContact from './pages/regular/RegularContact.vue';
import RegularHome from './pages/regular/RegularHome.vue';
import RegularLogin from './pages/regular/RegularLogin.vue';
import RegularSignup from './pages/regular/RegularSignup.vue';
import RegularNotFound from './pages/regular/RegularNotFound.vue';
import VerifyEmail from './pages/regular/VerifyEmail.vue';

// -------------------- dashboard ---------------------------
import Profile from './pages/dashboard/Profile.vue';
import DashboardLogin from './pages/dashboard/DashboardLogin.vue';
import DashboardSignup from './pages/dashboard/DashboardSignup.vue';
import DashboardNotFound from './pages/dashboard/DashboardNotFound.vue';
import Sessions from './pages/dashboard/Sessions.vue';
import SessionDetails from './components/dashboard/SessionDetails.vue';
import Videos from './pages/dashboard/Videos.vue';
import VideoDetails from './components/dashboard/VideoDetails.vue';

// --- settings ---
import Settings from './pages/dashboard/settings/Settings.vue';

// account
import UserDetails from './pages/dashboard/settings/account/UserDetails.vue';

// others
import SendFeedback from './pages/dashboard/settings/others/SendFeedback.vue';
import DashboardPrivacy from './pages/dashboard/settings/others/DashboardPrivacy.vue';
import DashboardTerms from './pages/dashboard/settings/others/DashboardTerms.vue';

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
    path: '/verify-email/:uid',
    name: 'Verify Email',
    component: VerifyEmail,
    props: true,
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
    name: 'RegularPrivacy',
    component: RegularPrivacy,
    meta: {
      layout: 'RegularLayout',
    },
  },
  {
    path: '/terms',
    name: 'RegularTerms',
    component: RegularTerms,
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
  // settings -> others
  {
    path: '/dashboard/settings/others/send-feedback',
    name: 'SendFeedback',
    component: SendFeedback,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/settings/others/privacy',
    name: 'DashboardPrivacy',
    component: DashboardPrivacy,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/settings/others/terms',
    name: 'DashboardTerms',
    component: DashboardTerms,
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
  // ----- Settings -----
  {
    path: '/dashboard/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      layout: 'DashboardLayout',
    },
  },
  {
    path: '/dashboard/settings/account/user-details',
    name: 'UserDetails',
    component: UserDetails,
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
