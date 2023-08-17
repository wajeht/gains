<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { isMobile, sleep } from '../../../../../utils/helpers.js';
import useUserStore from '../../../store/user.store.js';
import api from '../../../../../utils/fetch-with-style.js';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);

async function logout() {
  try {
    loading.value = true;

    const res = await api.get('/api/auth/logout');
    const json = await res.json();

    if (!res.ok) {
      loading.value = false;
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    userStore.isLoggedIn = false;
    userStore.clearUserInfo();

    let logoutLink = '/login';
    if (isMobile()) {
      logoutLink = '/dashboard/login';
    }

    router.push({ path: logoutLink });
  } catch (e) {
    loading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}
</script>

<template>
  <div
    id="dashboard-home-header"
    style="height: 64px"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3"
  >
    <!-- profile view -->
    <router-link to="/dashboard/profile" class="link-secondary" role="button">
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="user" />
        <span>My profile</span>
      </h5>
    </router-link>

    <!-- logout -->
    <button @click="logout()" class="btn btn-danger" :disabled="loading">
      <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span v-if="!loading">
        <font-awesome-icon icon="right-from-bracket" />
        Logout
      </span>
      <span v-if="loading"> Loading... </span>
    </button>
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
}
</style>
