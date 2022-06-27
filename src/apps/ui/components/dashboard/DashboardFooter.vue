<template>
  <!-- profile -->
  <ul class="position-sticky bottom-0 container nav nav-pills justify-content-between bg-dark">
    <li class="nav-item">
      <router-link
        :class="{ active: $route.name === 'Dashboard' }"
        to="/dashboard"
        class="nav-link d-flex flex-column"
      >
        <font-awesome-icon icon="trash" />
        <span>Profile</span>
      </router-link>
    </li>

    <!-- log -->
    <li class="nav-item">
      <router-link
        :class="{ active: $route.name === 'Logs' }"
        to="/dashboard/logs"
        class="nav-link d-flex flex-column"
      >
        <font-awesome-icon icon="pen" />
        <span>Logs</span>
      </router-link>
    </li>

    <!-- videos -->
    <li class="nav-item">
      <router-link
        :class="{ active: $route.name === 'Videos' }"
        to="/dashboard/videos"
        class="nav-link d-flex flex-column"
      >
        <font-awesome-icon icon="play" />
        <span>Videos</span>
      </router-link>
    </li>

    <!-- report -->
    <li class="nav-item">
      <router-link
        :class="{ active: $route.name === 'Reports' }"
        to="/dashboard/reports"
        class="nav-link d-flex flex-column"
      >
        <font-awesome-icon icon="table" />
        <span>Report</span>
      </router-link>
    </li>
  </ul>
</template>
