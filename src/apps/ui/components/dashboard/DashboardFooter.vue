<script setup>
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
</script>
<template>
  <div
    class="position-sticky bottom-0 container d-flex justify-content-between border-top bg-white text-muted"
    style="z-index: 2"
  >
    <!-- Home -->
    <router-link
      :class="{ active: $route.name === 'Community' }"
      class="d-flex flex-column py-3 gap-1"
      to="/dashboard/community"
    >
      <font-awesome-icon icon="user-group" />
      <span>Community</span>
    </router-link>

    <!-- Sessions -->
    <router-link
      :class="{ active: $route.name === 'Sessions' }"
      to="/dashboard/sessions"
      class="d-flex flex-column py-3 gap-1"
    >
      <font-awesome-icon icon="calendar-days" />
      <span>Sessions</span>
    </router-link>

    <!-- profile/videos -->
    <span>
      <!-- videos -->
      <router-link
        v-if="route.path === '/dashboard/videos'"
        :class="{ active: $route.name === 'Videos' }"
        class="d-flex flex-column py-3 gap-1"
        to="/dashboard/videos"
      >
        <font-awesome-icon icon="play" />
        <span>Videos</span>
      </router-link>

      <!-- profile -->
      <router-link
        v-else
        :class="{ active: $route.name === 'Profile' }"
        class="d-flex flex-column py-3 gap-1"
        to="/dashboard/profile"
      >
        <font-awesome-icon icon="user" />
        <span>Profile</span>
      </router-link>
    </span>

    <!-- Tools -->
    <router-link
      :class="{ active: $route.name === 'Tools' }"
      to="/dashboard/tools"
      class="d-flex flex-column py-3 gap-1"
    >
      <font-awesome-icon icon="screwdriver-wrench" />
      <span>Tools</span>
    </router-link>

    <!-- settings -->
    <router-link
      :class="{ active: $route.name === 'Settings' }"
      to="/dashboard/settings"
      class="d-flex flex-column py-3 gap-1"
    >
      <font-awesome-icon icon="gear" />
      <span>Settings</span>
    </router-link>
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
