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
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="`user-key-${u.id}`">
            <!-- id -->
            <th scope="row">{{ u.id }}</th>

            <!-- user -->
            <td>
              <div class="d-flex gap-1">
                <!-- pic -->
                <img :src="u.profile_picture_url" style="max-width: 20%; max-height: auto" />

                <!-- role -->
                <div class="d-flex flex-column gap-1">
                  <span class="d-flex gap-1 justify-content-center align-items-center">
                    <span class="fw-bold">{{ u.first_name + ' ' + u.last_name }}</span>
                    <small class="fst-italic">
                      - {{ u.role }}
                      <font-awesome-icon
                        v-if="u.role === 'admin'"
                        icon="fa-crown"
                        style="color: #faa819"
                    /></small>
                  </span>
                  <small class="d-flex flex-column">
                    <span> <i class="bi bi-person-fill me-1"></i>@{{ u.username }}</span>
                    <span>
                      <font-awesome-icon icon="fa-weight-scale " class="me-1" />{{ u.weight }}
                      {{ appStore.unit.label }}
                    </span>
                    <span>
                      <i class="bi bi-balloon-fill me-1"></i
                      >{{ dayjs(u.birth_date).format('YYYY/MM/DD') }}</span
                    >
                  </small>
                </div>
              </div>
            </td>

            <!-- date created -->
            <td>{{ dayjs(u.created_at).format('YYYY/MM/DD') }}</td>

            <!-- status -->
            <td>
              <div class="d-flex flex-column gap-1">
                <!-- verified -->
                <span
                  :class="{
                    'bg-success text-white px-1 rounded': u.verified,
                    'bg-danger text-white px-1 rounded': !u.verified,
                  }"
                >
                  <span v-if="!u.verified">not verified</span>
                  <span v-if="u.verified">verified</span>
                </span>

                <!-- deleted -->
                <span
                  :class="{
                    'bg-success text-white px-1 rounded': !u.deleted,
                    'bg-danger text-white px-1 rounded': u.deleted,
                  }"
                >
                  <span v-if="!u.deleted">active</span>
                  <span v-if="u.deleted">inactive</span>
                </span>
              </div>
            </td>

            <!-- actions -->
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
/* :class="{ 'grayscale text-muted': !u.verified || u.deleted }" */
.grayscale {
  filter: grayscale(100);
}
</style>
