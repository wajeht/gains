<script setup>
import { reactive, onMounted } from 'vue';
import api from '../../../../utils/fetch-with-style';

const states = reactive({
  users: 0,
});

async function getStats() {
  try {
    const result = await api.get('/api/admin/stats');
    const data = await result.json();

    states.users = data.data[0].users.length;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await getStats();
});
</script>

<template>
  <div class="card text-dark mb-3" style="max-width: 18rem">
    <div class="card-header">Users</div>
    <div class="card-body">
      <h5 class="card-title">{{ states.users }}</h5>
      <p class="card-text">Registrations this week.</p>
    </div>
    <div class="card-footer text-center">
      <router-link to="/admin/users">
        <small class="text-muted">More info ➡</small>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: grey;
}
</style>
