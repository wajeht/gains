<script setup>
import { ref, onUnmounted, onMounted } from 'vue';
import api from '../../../../utils/fetch-with-style.js';
import useAppStore from '../../store/app.store.js';

const appStore = useAppStore();
const users = ref([]);

window.socket.on('onlineUser', (onlineUsers) => {
  console.log('Online Users', onlineUsers);
  users.value = onlineUsers;
});

window.socket.on('userDisconnected', (disconnectedSocketId) => {
  users.value = users.value.filter((user) => user.socket_id !== disconnectedSocketId);
});

onMounted(async () => {
  users.value = (await fetchLatestOnlineUsers()) || [];
});

onUnmounted(() => {
  window.socket.off('onlineUser');
  window.socket.off('userDisconnected');
});

async function fetchLatestOnlineUsers() {
  try {
    const res = await api.get(`/api/admin/online-users`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    return json.data;
  } catch (e) {
    appStore.loading = false;
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
  <div class="list-group">
    <div
      v-for="u in users"
      :key="`user-key-${u.id}`"
      class="d-flex align-items-center gap-2 list-group-item list-group-item-action list-group-item-hover"
    >
      <div style="position: relative">
        <img
          v-if="u.profile_picture_url"
          class="rounded"
          :src="u.profile_picture_url"
          width="35"
          height="35"
        />
        <div
          v-else
          style="background-color: lightgrey; width: 35px; height: 35px; border-radius: 10%"
        />
        <div
          style="
            background-color: green;
            border-radius: 50%;
            padding: 5px;
            position: absolute;
            right: 0;
            bottom: 0px;
          "
        ></div>
      </div>
      <span class="d-flex flex-column">
        <span class="fw-normal">{{ u.username }}</span>
        <small class="text-muted fst-italic fw-light" style="margin-top: -5px"
          ><small>{{ u.agent }}</small></small
        >
      </span>
    </div>
  </div>
</template>
