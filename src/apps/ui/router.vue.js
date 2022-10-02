import { createRouter, createWebHistory } from 'vue-router';
import useUserStore from './store/user.store.js';

// -------------------- regular ---------------------------
import Features from './pages/regular/Features.vue';
import ForgetPassword from './pages/regular/ForgetPassword.vue';
import ResetPassword from './pages/regular/ResetPassword.vue';
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
import Community from './pages/dashboard/Community.vue';
import DashboardNotFound from './pages/dashboard/DashboardNotFound.vue';
import DashboardUnauthorized from './pages/dashboard/DashboardUnauthorized.vue';
import Videos from './pages/dashboard/Videos.vue';
import VideoDetails from './components/dashboard/VideoDetails.vue';

// --- sessions ---
import Sessions from './pages/dashboard/sessions/Sessions.vue';
import SessionDetails from './components/dashboard/SessionDetails.vue';
import Blocks from './pages/dashboard/sessions/Blocks.vue';
import Categories from './pages/dashboard/sessions/Categories.vue';
import Exercises from './pages/dashboard/sessions/Exercises.vue';

import Exercise from './pages/dashboard/Exercise.vue';
import Block from './pages/dashboard/Block.vue';
import Category from './pages/dashboard/Category.vue';

// --- settings ---
import Settings from './pages/dashboard/settings/Settings.vue';

// account
import UserDetails from './pages/dashboard/settings/account/UserDetails.vue';
import DeleteAccount from './pages/dashboard/settings/account/DeleteAccount.vue';

// data
import ApiKeys from './pages/dashboard/settings/data/ApiKeys.vue';

// others
import SendFeedback from './pages/dashboard/settings/others/SendFeedback.vue';
import DashboardPrivacy from './pages/dashboard/settings/others/DashboardPrivacy.vue';
import DashboardTerms from './pages/dashboard/settings/others/DashboardTerms.vue';
import Changelogs from './pages/dashboard/settings/others/Changelogs.vue';
import HelpAndSupport from './pages/dashboard/settings/others/HelpAndSupport.vue';

// tools
import Tools from './pages/dashboard/tools/Tools.vue';
import OpenPowerlifting from './pages/dashboard/tools/reports/OpenPowerlifting.vue';
import OneRepMaxCalculator from './pages/dashboard/tools/calculators/OneRepMaxCalculator.vue.vue';
import AttemptSelectionCalculator from './pages/dashboard/tools/calculators/AttemptSelectionCalculator.vue';
import RPECalculator from './pages/dashboard/tools/calculators/RPECalculator.vue';
import PlateCalculator from './pages/dashboard/tools/calculators/PlateCalculator.vue';
import BodyweightTracker from './pages/dashboard/tools/others/BodyweightTracker.vue';
import CaloriesTracker from './pages/dashboard/tools/others/CaloriesTracker.vue';
import Recovery from './pages/dashboard/tools/others/Recovery.vue';
import AccessCodes from './pages/dashboard/tools/others/AccessCodes.vue';

const routes = [
  // regular
  {
    path: '/',
    name: 'Home',
    component: RegularHome,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: RegularLogin,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: RegularSignup,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/forget-password',
    name: 'Forget Password',
    component: ForgetPassword,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/reset-password/:uid',
    name: 'Reset Password',
    component: ResetPassword,
    props: true,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/verify-email/:uid',
    name: 'Verify Email',
    component: VerifyEmail,
    props: true,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/features',
    name: 'Features',
    component: Features,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: RegularContact,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/privacy',
    name: 'RegularPrivacy',
    component: RegularPrivacy,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/terms',
    name: 'RegularTerms',
    component: RegularTerms,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: RegularNotFound,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  // dashboard
  {
    path: '/dashboard/login',
    name: 'DashboardLogin',
    component: DashboardLogin,
    meta: {
      layout: 'EmptyDashboardLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/dashboard/signup',
    name: 'DashboardSignup',
    component: DashboardSignup,
    meta: {
      layout: 'EmptyDashboardLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/dashboard/community',
    name: 'Community',
    component: Community,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  // settings -> others
  {
    path: '/dashboard/settings/others/send-feedback',
    name: 'SendFeedback',
    component: SendFeedback,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/settings/others/changelogs',
    name: 'Changelogs',
    component: Changelogs,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/settings/others/help-and-support',
    name: 'HelpAndSupport',
    component: HelpAndSupport,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/settings/others/privacy',
    name: 'DashboardPrivacy',
    component: DashboardPrivacy,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/settings/others/terms',
    name: 'DashboardTerms',
    component: DashboardTerms,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  // Tools
  {
    path: '/dashboard/tools',
    name: 'Tools',
    component: Tools,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  // 1rm
  {
    path: '/dashboard/tools/calculators/one-rep-max-calculator',
    name: 'OneRepMaxCalculator',
    component: OneRepMaxCalculator,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  // rpe
  {
    path: '/dashboard/tools/calculators/rpe-calculator',
    name: 'RPECalculator',
    component: RPECalculator,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  // plate
  {
    path: '/dashboard/tools/calculators/plate-calculator',
    name: 'PlateCalculator',
    component: PlateCalculator,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  // attempt
  {
    path: '/dashboard/tools/calculators/attempt-selection-calculator',
    name: 'AttemptSelectionCalculator',
    component: AttemptSelectionCalculator,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  // reports
  {
    path: '/dashboard/tools/reports/open-powerlifting',
    name: 'OpenPowerlifting',
    component: OpenPowerlifting,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  // bodyweight tracker
  {
    path: '/dashboard/tools/others/bodyweight-tracker',
    name: 'BodyweightTracker',
    component: BodyweightTracker,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/tools/others/calories-tracker',
    name: 'CaloriesTracker',
    component: CaloriesTracker,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/tools/others/recovery',
    name: 'Recovery',
    component: Recovery,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/tools/others/access-codes',
    name: 'AccessCodes',
    component: AccessCodes,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  // ----- Settings -----
  {
    path: '/dashboard/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/settings/account/user-details',
    name: 'UserDetails',
    component: UserDetails,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/settings/account/delete-account',
    name: 'DeleteAccount',
    component: DeleteAccount,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/settings/data/api-keys',
    name: 'ApiKeys',
    component: ApiKeys,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/videos',
    name: 'Videos',
    component: Videos,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/videos/:id',
    name: 'VideoDetails',
    component: VideoDetails,
    props: true,
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  // ----- sessions -----
  {
    path: '/dashboard/sessions',
    name: 'Sessions',
    component: Sessions,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/sessions/blocks',
    name: 'Blocks',
    component: Blocks,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/sessions/categories',
    name: 'Categories',
    component: Categories,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/sessions/exercises',
    name: 'Exercises',
    component: Exercises,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/exercises/:exercise_id',
    name: 'Exercise',
    component: Exercise,
    props: (route) => ({
      exercise_id: Number(route.params.exercise_id),
    }),
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/blocks/:block_id',
    name: 'Block',
    component: Block,
    props: (route) => ({
      block_id: Number(route.params.block_id),
    }),
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/categories/:category_id',
    name: 'Category',
    component: Category,
    props: (route) => ({
      category_id: Number(route.params.category_id),
    }),
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/sessions/:sid',
    name: 'SessionDetails',
    component: SessionDetails,
    props: (route) => ({
      sid: Number(route.params.sid),
    }),
    meta: {
      layout: 'SingleDashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/dashboard/unauthorized',
    name: 'DashboardUnauthorized',
    component: DashboardUnauthorized,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: RegularNotFound,
    meta: {
      layout: 'RegularLayout',
      requiredAuth: false,
    },
  },
  {
    path: '/dashboard/:err+',
    name: '404',
    component: DashboardNotFound,
    meta: {
      layout: 'DashboardLayout',
      requiredAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  document.title = to.name;
  const userStore = useUserStore();

  // TODO: refactor this code below!
  // if we hit required routes
  if (to.matched.some((record) => record.meta.requiredAuth)) {
    // if user has already logged in
    if (userStore.isLoggedIn) {
      // let them go wherever they want

      //! ALERT: moved this code below to main.vue.js
      //! we don't check every routes call anymore,
      //! instead we check on app start
      // check to see if token is still valid
      // const res = await window.fetch(`/api/v1/users/check-authentication`);
      // if (!res.ok) {
      //   userStore.isLoggedIn = false;
      //   userStore.clearUserInfo();
      // }

      next();
    } else {
      // else go back to login page
      next('/dashboard/login');
    }
  } else {
    if (userStore.isLoggedIn) {
      // check to see if token is still valid
      const res = await window.fetch(`/api/v1/users/${userStore.user.id}`);
      if (!res.ok) {
        userStore.isLoggedIn = false;
        userStore.clearUserInfo();
      }

      // if they are already login, redirect to dashboard
      if (to.path.match(/(login)|(signup)/)?.length) {
        return next('/dashboard/profile');
      }
    }
    next();
  }
});

export default router;
