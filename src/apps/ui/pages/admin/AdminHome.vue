<script setup>
import { reactive, onMounted } from 'vue';
import api from '../../../../utils/fetch-with-style';

const states = reactive({
  users: 0,
  videos: 0,
});

async function getStats() {
  try {
    const result = await api.get('/api/admin/stats');
    const data = await result.json();

    states.users = data.data[0].users.length;
    states.videos = data.data[0].videos.length;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await getStats();
});
</script>

<template>
  <div class="row">
      <!-- users -->
    <div class="col">
      <div class="card text-dark">
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
    </div>

    <!-- videos -->
    <div class="col">
      <div class="card text-dark">
        <div class="card-header">Videos</div>
        <div class="card-body">
          <h5 class="card-title">{{ states.videos }}</h5>
          <p class="card-text">Videos uploaded this week.</p>
        </div>
        <div class="card-footer text-center">
          <router-link to="/admin/videos">
            <small class="text-muted">More info ➡</small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: grey;
}
</style>
