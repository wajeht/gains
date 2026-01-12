<script setup>
import { reactive, ref } from 'vue';
import RegularHeader from '../components/regular/RegularHeader.vue';
import RegularFooter from '../components/regular/RegularFooter.vue';
import AdminMenuBar from '../components/admin/AdminMenuBar.vue';
import LogoutButton from '../components/dashboard/LogoutButton.vue';
import useAppStore from '../store/app.store.js';
import api from '@utils/fetch-with-style.js';

const appStore = useAppStore();

const refreshDatabaseIndexesLoading = ref(false);

const states = reactive({
  alert: {
    msg: '',
    type: '',
  },
  loading: false,
});

async function refreshDatabaseIndexes() {
  try {
    refreshDatabaseIndexesLoading.value = true;
    const res = await api.get(`/api/admin/refresh-index`);
    const json = await res.json();

    if (res.status >= 500) {
      throw new Error(
        'The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again later!',
      );
    }

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    refreshDatabaseIndexesLoading.value = false;

    states.alert.type = 'success';
    states.alert.msg = 'All indexes have been refreshed';

    setTimeout(() => {
      states.alert.type = '';
      states.alert.msg = '';
    }, 5000);

    window.scrollTo(0, 0);
  } catch (e) {
    appStore.loading = false;
    refreshDatabaseIndexesLoading.value = false;
    states.alert.type = 'danger';
    if (Array.isArray(e)) {
      states.alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      states.alert.msg = e;
    }
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

          <!-- refresh index -->
          <button
            class="btn btn-dark"
            :disabled="refreshDatabaseIndexesLoading"
            style="min-height: 43px !important"
            @click="refreshDatabaseIndexes"
          >
            <div
              v-if="refreshDatabaseIndexesLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!refreshDatabaseIndexesLoading"> Refresh All Indexes </span>
            <span v-if="refreshDatabaseIndexesLoading"> Loading... </span>
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
