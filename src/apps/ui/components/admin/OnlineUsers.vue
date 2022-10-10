<script setup>
import api from '../../../../utils/fetch-with-style.js';
import useAppStore from '../../store/app.store.js';
import { onMounted, ref } from 'vue';
import { io } from 'socket.io-client';

const appStore = useAppStore();
const socket = io('/');
const users = ref([]);

onMounted(async () => {
  users.value = (await fetchLatestOnlineUsers()) || [];
});

socket.on('online-user', (data) => {
  users.value = data;
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
  <div class="list-group">
    <div
      v-for="u in users"
      :key="`user-key-${u.id}`"
      class="d-flex align-items-center gap-2 list-group-item list-group-item-action list-group-item-hover"
    >
      <div style="position: relative">
        <img class="rounded" :src="u.profile_picture_url" width="30" height="30" />
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
      <span>{{ u.username }}</span>
    </div>
  </div>
</template>
