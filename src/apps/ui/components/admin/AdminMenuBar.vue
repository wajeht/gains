<script setup>
import useAppStore from '../../store/app.store.js';
const appStore = useAppStore();
</script>

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

    <!-- show activity -->
    <div
      @click="appStore.showActivity = !appStore.showActivity"
      class="list-group-item list-group-item-action"
    >
      <div class="form-check form-switch d-flex justify-content-between p-0">
        <label class="form-check-label inline-block p-0" for="show-activity">
          <span @click="appStore.showActivity = false" v-if="appStore.showActivity"
            >Hide activities</span
          >
          <span @click="appStore.showActivity = true" v-else>Show activities</span>
        </label>
        <input
          class="form-check-input"
          v-model="appStore.showActivity"
          type="checkbox"
          id="show-activity"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item.active {
  border-color: #383d3f;
  background: #212529;
  color: white;
}
</style>
