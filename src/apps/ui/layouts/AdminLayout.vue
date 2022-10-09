<script setup>
import RegularHeader from '../components/regular/RegularHeader.vue';
import RegularFooter from '../components/regular/RegularFooter.vue';
import ActivityLog from '../components/admin/ActivityLog.vue';
import AdminMenuBar from '../components/admin/AdminMenuBar.vue';
import LogoutButton from '../components/dashboard/LogoutButton.vue';
import useAppStore from '../store/app.store.js';
const appStore = useAppStore();
</script>

<template>
  <div id="admin" class="d-flex flex-column min-vh-100">
    <RegularHeader />

    <div class="px-4 animate__animated animate__fadeIn flex-grow-1 container">
      <div class="row gap-2">
        <!-- menu -->
        <div class="col-sm-12 col-lg-3 d-flex flex-column gap-3">
          <!-- menu -->
          <AdminMenuBar />
          <LogoutButton />
        </div>

        <!-- card -->
        <div class="col d-flex flex-column gap-4">
          <!-- admin pages -->
          <router-view> </router-view>

          <!-- log -->
          <ActivityLog v-if="appStore.showActivity" />
        </div>
      </div>
    </div>

    <RegularFooter />
  </div>
</template>
