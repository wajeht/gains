<script setup>
import { useRouter, useRoute } from 'vue-router';
import useAppStore from '../../store/app.store.js';
import useUserStore from '../../store/user.store';

const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();
</script>
<template>
  <div
    id="dashboard-footer"
    class="position-sticky bottom-0 container border-top bg-white text-muted"
    style="z-index: 2"
  >
    <div class="d-flex flex-row">
      <!-- community-session -->
      <div v-if="appStore.community" class="col">
        <router-link
          :class="{ active: $route.name === 'Community' }"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1 min-heigh-on-mobile"
          to="/dashboard/community"
        >
          <font-awesome-icon icon="user-group" class="big-font-size-on-mobile" />
          <span class="hide-on-mobile">Community</span>
        </router-link>
      </div>

      <!-- Sessions -->
      <div class="col">
        <router-link
          :class="{ active: $route.name === 'Sessions' }"
          to="/dashboard/sessions"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1 min-heigh-on-mobile"
        >
          <font-awesome-icon icon="calendar-days" class="big-font-size-on-mobile" />
          <span class="hide-on-mobile">Sessions</span>
        </router-link>
      </div>

      <!-- profile/videos -->
      <div class="col" v-if="route.path === '/dashboard/videos'">
        <!-- videos -->
        <router-link
          :class="{ active: $route.name === 'Videos' }"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1 min-heigh-on-mobile"
          to="/dashboard/videos"
        >
          <font-awesome-icon icon="play" class="big-font-size-on-mobile" />
          <span class="hide-on-mobile">Videos</span>
        </router-link>
      </div>

      <!-- profile -->
      <div class="col" v-else>
        <router-link
          :class="{ active: $route.name === 'Profile' }"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1 min-heigh-on-mobile"
          :to="`/dashboard/profile/${userStore.user.username}`"
        >
          <font-awesome-icon icon="user" class="big-font-size-on-mobile" />
          <span class="hide-on-mobile">Profile</span>
        </router-link>
      </div>

      <!-- Tools -->
      <div class="col">
        <router-link
          :class="{ active: $route.name === 'Tools' }"
          to="/dashboard/tools"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1 min-heigh-on-mobile"
        >
          <font-awesome-icon icon="screwdriver-wrench" class="big-font-size-on-mobile" />
          <span class="hide-on-mobile">Tools</span>
        </router-link>
      </div>

      <!-- settings -->
      <div class="col">
        <router-link
          :class="{ active: $route.name === 'Settings' }"
          to="/dashboard/settings"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1 min-heigh-on-mobile"
        >
          <font-awesome-icon icon="gear" class="big-font-size-on-mobile" />
          <span class="hide-on-mobile">Settings</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-muted {
  color: #8c8c8c;
}

a {
  text-decoration: none;
  color: grey;
}

a:hover {
  color: #191919;
}

.active {
  text-decoration: none;
  color: #191919;
  /* border-top: 2px solid #191919;
  margin-top: -2px; */
  box-shadow: 0 4px 0 #000 inset;
}

@media screen and (max-width: 540px) {
  .min-heigh-on-mobile {
    min-height: 70px;
  }
  .big-font-size-on-mobile {
    font-size: 1.2rem;
  }
  .hide-on-mobile {
    display: none;
  }
}
</style>
