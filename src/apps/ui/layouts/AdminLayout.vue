<script setup>
import { reactive } from 'vue';
import RegularHeader from '../components/regular/RegularHeader.vue';
import RegularFooter from '../components/regular/RegularFooter.vue';
import ActivityLog from '../components/admin/ActivityLog.vue';
import AdminMenuBar from '../components/admin/AdminMenuBar.vue';
import LogoutButton from '../components/dashboard/LogoutButton.vue';
import useAppStore from '../store/app.store.js';
import OnlineUsers from '../components/admin/OnlineUsers.vue';
import api from '../../../utils/fetch-with-style.js';

const appStore = useAppStore();

const states = reactive({
  alert: {
    msg: '',
    type: '',
  },
  loading: false,
});

async function clearAllCache() {
  try {
    states.loading = true;
    await api.get('/api/admin/clear-all-cache');
    states.alert.type = 'success';
    states.alert.msg = 'All cache in the systems has been cleared!';

    setTimeout(() => {
      states.alert.type = '';
      states.alert.msg = '';
    }, 5000);
  } catch (e) {
    states.loading = false;
    states.alert.type = 'danger';
    if (Array.isArray(e)) {
      states.alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      states.alert.msg = e;
    }
  } finally {
    states.loading = false;
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
          <button
            class="btn btn-primary"
            :disabled="states.loading"
            style="min-height: 43px !important"
            @click="clearAllCache"
          >
            <div v-if="states.loading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!states.loading"> Clear All Cache </span>
            <span v-if="states.loading"> Loading... </span>
          </button>

          <!-- logout -->
          <LogoutButton style="min-height: 43px !important" />
        </div>

        <!-- card -->
        <div class="col d-flex flex-column gap-4">
          <!-- alert -->
          <div
            v-if="states.alert.type"
            :class="`alert-${states.alert.type}`"
            class="alert"
            style="margin-bottom: -10px"
          >
            <span>{{ states.alert.msg }}</span>
          </div>

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
