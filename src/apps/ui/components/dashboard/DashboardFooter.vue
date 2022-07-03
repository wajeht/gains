<template>
  <!-- profile -->
  <div
    class="
      position-sticky
      bottom-0
      container
      d-flex
      justify-content-between
      border-top
      bg-white
      text-muted
    "
  >
    <router-link
      :class="{ active: $route.name === 'Profile' }"
      class="d-flex flex-column py-3 gap-1"
      to="/dashboard/profile"
    >
      <font-awesome-icon icon="user" />
      <span>Profile</span>
    </router-link>

    <!-- log -->
    <router-link
      :class="{ active: $route.name === 'Sessions' }"
      to="/dashboard/sessions"
      class="d-flex flex-column py-3 gap-1"
    >
      <font-awesome-icon icon="calendar-days" />
      <span>Sessions</span>
    </router-link>

    <!-- videos -->
    <router-link
      :class="{ active: $route.name === 'Videos' }"
      to="/dashboard/videos"
      class="d-flex flex-column py-3 gap-1"
    >
      <font-awesome-icon icon="play" />
      <span>Videos</span>
    </router-link>

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
    border-top: 2px solid #191919;
    margin-top: -2px;
  }
</style>
