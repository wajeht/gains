<script setup>
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
</script>
<template>
  <div class="position-sticky bottom-0 container border-top bg-white text-muted" style="z-index: 2">
    <div class="d-flex flex-row">
      <!-- Home -->
      <div class="col">
        <router-link
          :class="{ active: $route.name === 'Community' }"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1"
          to="/dashboard/community"
        >
          <font-awesome-icon icon="user-group" />
          <span>Community</span>
        </router-link>
      </div>

      <!-- Sessions -->
      <div class="col">
        <router-link
          :class="{ active: $route.name === 'Sessions' }"
          to="/dashboard/sessions"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1"
        >
          <font-awesome-icon icon="calendar-days" />
          <span>Sessions</span>
        </router-link>
      </div>

      <!-- profile/videos -->
      <div class="col" v-if="route.path === '/dashboard/videos'">
        <!-- videos -->
        <router-link
          :class="{ active: $route.name === 'Videos' }"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1"
          to="/dashboard/videos"
        >
          <font-awesome-icon icon="play" />
          <span>Videos</span>
        </router-link>
      </div>

      <!-- profile -->
      <div class="col" v-else>
        <router-link
          :class="{ active: $route.name === 'Profile' }"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1"
          to="/dashboard/profile"
        >
          <font-awesome-icon icon="user" />
          <span>Profile</span>
        </router-link>
      </div>

      <!-- Tools -->
      <div class="col">
        <router-link
          :class="{ active: $route.name === 'Tools' }"
          to="/dashboard/tools"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1"
        >
          <font-awesome-icon icon="screwdriver-wrench" />
          <span>Tools</span>
        </router-link>
      </div>

      <!-- settings -->
      <div class="col">
        <router-link
          :class="{ active: $route.name === 'Settings' }"
          to="/dashboard/settings"
          class="d-flex flex-column justify-content-center align-items-center py-3 gap-1"
        >
          <font-awesome-icon icon="gear" />
          <span>Settings</span>
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
</style>
