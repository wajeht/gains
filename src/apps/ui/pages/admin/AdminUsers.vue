<script setup>
import { ref, onMounted, reactive } from 'vue';
import useAppStore from '../../store/app.store.js';
import api from '../../../../utils/fetch-with-style.js';
import dayjs from 'dayjs';

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
    <div class="card-header">Featured</div>
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">User</th>
            <th scope="col">Date Created</th>
            <th scope="col">Verified</th>
            <th scope="col">Deleted</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in users"
            :key="`user-key-${u.id}`"
            :class="{ 'grayscale text-muted': !u.verified || u.deleted }"
          >
            <th scope="row">{{ u.id }}</th>
            <td>
              <div class="d-flex gap-1">
                <!-- pic -->
                <img :src="u.profile_picture_url" style="max-width: 50px; max-height: auto" />

                <!-- role -->
                <div class="d-flex flex-column gap-1">
                  <span class="d-flex gap-1 justify-content-center align-items-center">
                    <span class="fw-bold">{{ u.first_name + ' ' + u.last_name }}</span>
                    <small class="fst-italic"> - {{ u.role }}</small>
                  </span>
                  <small class="d-flex flex-column">
                    <span>@{{ u.username }}</span>
                    <span>{{ u.weight }} {{ appStore.unit.label }}</span>
                    <span>{{ dayjs(u.birth_date).format('YYYY/MM/DD') }}</span>
                  </small>
                </div>
              </div>
            </td>
            <td>{{ dayjs(u.created_at).format('YYYY/MM/DD') }}</td>
            <td>{{ u.verified }}</td>
            <td>{{ u.deleted }}</td>
            <td>
              <div class="d-flex gap-2">
                <span role="button"><i class="bi bi-pencil-square"></i></span>
                <span role="button"><i class="bi bi-trash"></i></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer text-muted">2 days ago</div>
  </div>
</template>

<style scoped>
.grayscale {
  filter: grayscale(100);
}
</style>
