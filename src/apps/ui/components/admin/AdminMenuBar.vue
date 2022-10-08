<template>
  <div class="list-group">
    <!-- home -->
    <router-link
      to="/admin"
      class="list-group-item list-group-item-action"
      :class="{ active: $route.path === '/admin' }"
      >Home
    </router-link>

    <!-- users -->
    <router-link
      to="/admin/users"
      class="list-group-item list-group-item-action"
      :class="{ active: $route.path === '/admin/users' }"
      >Users
    </router-link>

    <!-- videos -->
    <router-link
      to="/admin/videos"
      class="list-group-item list-group-item-action"
      :class="{ active: $route.path === '/admin/videos' }"
      >Videos</router-link
    >

    <!-- sessions -->
    <router-link
      to="/admin/sessions"
      class="list-group-item list-group-item-action"
      :class="{ active: $route.path === '/admin/sessions' }"
      >Sessions</router-link
    >
  </div>
</template>

<style scoped>
.list-group-item.active {
  border-color: #383d3f;
  background: #212529;
  color: white;
}
</style>
