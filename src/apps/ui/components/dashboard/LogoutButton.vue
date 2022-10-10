<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { sleep, isMobile } from '../../../../utils/helpers.js';
import api from '../../../../utils/fetch-with-style.js';
import useUserStore from '../../store/user.store.js';
import { io } from 'socket.io-client';

const socket = io('/');
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

async function logout() {
  try {
    loading.value = true;

    await sleep(800);

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

    socket.emit('logout-user', userStore.user.id);

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
  <button @click="logout()" class="btn btn-sm btn-danger" :disabled="loading">
    <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <span v-if="!loading">
      <font-awesome-icon icon="right-from-bracket" />
      Logout
    </span>
    <span v-if="loading"> Loading... </span>
  </button>
</template>
