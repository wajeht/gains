<script setup>
import RegularHeader from '../components/regular/RegularHeader.vue';
import RegularFooter from '../components/regular/RegularFooter.vue';
import ActivityLog from '../components/admin/ActivityLog.vue';
import AdminMenuBar from '../components/admin/AdminMenuBar.vue';
import LogoutButton from '../components/dashboard/LogoutButton.vue';
import useAppStore from '../store/app.store.js';
import OnlineUsers from '../components/admin/OnlineUsers.vue';
import api from '../../../utils/fetch-with-style.js';

const appStore = useAppStore();

async function clearAllCache() {
  try {
    await api.get('/api/admin/clear-all-cache');
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div id="admin" class="d-flex flex-column min-vh-100">
    <RegularHeader />

    <div class="px-4 animate__animated animate__fadeIn flex-grow-1 container">
      <div class="row gap-2">
        <!-- menu -->
        <div class="col-sm-12 col-lg-3 d-flex flex-column gap-3 sticky">
          <!-- menu -->
          <AdminMenuBar />

          <!-- online -->
          <OnlineUsers />

          <!-- clear all cache -->
          <button class="btn btn-dark" style="min-height: 43px !important" @click="clearAllCache">
            Clear All Cache
          </button>

          <!-- logout -->
          <LogoutButton style="min-height: 43px !important" />
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

<style scoped>
.sticky {
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 97px !important;
  align-self: flex-start !important;
}

@media screen and (max-width: 992px) {
  .sticky {
    position: unset !important;
    top: unset !important;
    align-self: unset !important;
  }
}
</style>
