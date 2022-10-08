<template>
  <div id="regular" class="d-flex flex-column min-vh-100">
    <RegularHeader />

    <div class="px-4 mx-auto animate__animated animate__fadeIn flex-grow-1">
      <div class="row gap-3">
        <!-- menu -->
        <div class="col-sm-12 col-lg-3">
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
        </div>

        <!-- card -->
        <div class="col">
          <router-view> </router-view>
        </div>
      </div>
    </div>

    <RegularFooter />
  </div>
</template>

<script>
import RegularHeader from '../components/regular/RegularHeader.vue';
import RegularFooter from '../components/regular/RegularFooter.vue';
export default {
  components: {
    RegularHeader,
    RegularFooter,
  },
};
</script>
