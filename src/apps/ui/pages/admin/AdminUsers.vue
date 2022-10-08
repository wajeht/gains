<script setup>
import { ref, onMounted, reactive } from 'vue';
import useAppStore from '../../store/app.store.js';
import api from '../../../../utils/fetch-with-style.js';

const appStore = useAppStore();
const alert = reactive({ type: '', msg: '' });
const users = ref([]);

onMounted(async () => {
  await fetchUsers();
});

async function fetchUsers() {
  try {
    const res = await api.get(`/api/v1/users`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    users.value = json.data;
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
  <!-- alert -->
  <div v-if="alert.type" :class="`alert-${alert.type}`" class="alert mb-0">
    <span>{{ alert.msg }}</span>
  </div>

  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Admin Users</h5>
      <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
      <p class="card-text">
        <pre>
        {{ users }}
        </pre>
      </p>
      <a href="#" class="card-link">Card link</a>
      <a href="#" class="card-link">Another link</a>
    </div>
  </div>
</template>
