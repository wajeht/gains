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
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Admin home</h5>
      <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk of the card's
        content.
      </p>

      <div class="card">
        {{ users }}
      </div>

      <a href="#" class="card-link">Card link</a>
      <a href="#" class="card-link">Another link</a>
    </div>
  </div>
</template>
