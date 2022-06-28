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
      :class="{ active: $route.name === 'Dashboard' }"
      class="d-flex flex-column py-3"
      to="/dashboard/profile"
    >
      <font-awesome-icon icon="trash" />
      <span>Profile</span>
    </router-link>

    <!-- log -->
    <router-link
      :class="{ active: $route.name === 'Logs' }"
      to="/dashboard/logs"
      class="d-flex flex-column py-3"
    >
      <font-awesome-icon icon="pen" />
      <span>Logs</span>
    </router-link>

    <!-- videos -->
    <router-link
      :class="{ active: $route.name === 'Videos' }"
      to="/dashboard/videos"
      class="d-flex flex-column py-3"
    >
      <font-awesome-icon icon="play" />
      <span>Videos</span>
    </router-link>

    <!-- report -->
    <router-link
      :class="{ active: $route.name === 'Reports' }"
      to="/dashboard/reports"
      class="d-flex flex-column py-3"
    >
      <font-awesome-icon icon="table" />
      <span>Reports</span>
    </router-link>

    <!-- settings -->
    <router-link
      :class="{ active: $route.name === 'Settings' }"
      to="/dashboard/settings"
      class="d-flex flex-column py-3"
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
