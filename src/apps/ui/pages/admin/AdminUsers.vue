<script setup>
import { ref, onMounted, reactive } from 'vue';
import useAppStore from '../../store/app.store.js';
import api from '../../../../utils/fetch-with-style.js';
import dayjs from 'dayjs';
import { sleep } from '../../../../utils/helpers.js';
import InsideLoading from '../../components/shared/InsideLoading.vue';

const appStore = useAppStore();
const alert = reactive({ type: '', msg: '' });
const users = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;

  await sleep(1000);
  await fetchUsers();

  loading.value = false;
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

  <div style="position: relative">
    <!-- loading -->
    <InsideLoading v-if="loading" />

    <!-- card -->
    <div class="card">
      <!-- header -->
      <div class="card-header">Featured</div>

      <!-- body -->
      <div class="card-body" style="overflow: scroll !important">
        <!-- table -->
        <table class="table text-nowrap">
          <!-- table header -->
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">User</th>
              <th scope="col">Date Created</th>
              <th scope="col">Account Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <!-- table body -->
          <tbody>
            <tr v-for="u in users" :key="`user-key-${u.id}`">
              <!-- id -->
              <th scope="row">{{ u.id }}</th>

              <!-- user -->
              <td>
                <div class="d-flex gap-1">
                  <!-- pic -->
                  <img
                    :src="u.profile_picture_url"
                    style="max-width: 20%; max-height: auto; box-sizing: border-box"
                    :style="{
                      'border-left': u.role === 'admin' ? '5px solid #FAA819 !important' : '',
                    }"
                  />

                  <!-- role -->
                  <div class="d-flex flex-column gap-1">
                    <span class="d-flex gap-1 justify-content-center align-items-center">
                      <span class="fw-bold">{{ u.first_name + ' ' + u.last_name }}</span>
                      <small class="fst-italic fw-light">
                        - {{ u.role }}
                        <font-awesome-icon
                          v-if="u.role === 'admin'"
                          icon="fa-crown"
                          style="color: #faa819"
                      /></small>
                    </span>
                    <small class="d-flex flex-column fw-light">
                      <!-- username -->
                      <span><i class="bi bi-person-fill me-1"></i>@{{ u.username }}</span>

                      <!-- weight -->
                      <span v-if="u.weight">
                        <font-awesome-icon icon="fa-weight-scale " class="me-1" />{{ u.weight }}
                        {{ appStore.unit.label }}
                      </span>

                      <!-- birthday -->
                      <span v-if="u.birth_date">
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
                <div style="display: inline-block !important">
                  <div class="d-flex flex-column gap-1">
                    <!-- verified -->
                    <small
                      :class="{
                        'bg-success text-white px-1 rounded': u.verified,
                        'bg-danger text-white px-1 rounded': !u.verified,
                      }"
                    >
                      <span v-if="!u.verified">not verified</span>
                      <span v-if="u.verified">verified</span>
                    </small>

                    <!-- deleted -->
                    <small
                      :class="{
                        'bg-success text-white px-1 rounded': !u.deleted,
                        'bg-danger text-white px-1 rounded': u.deleted,
                      }"
                    >
                      <span v-if="!u.deleted">active</span>
                      <span v-if="u.deleted">inactive</span>
                    </small>
                  </div>
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

      <!-- footer -->
      <div class="card-footer text-muted">
        <nav aria-label="Page navigation example" class="py-2">
          <ul class="pagination justify-content-center mb-0 pb-0">
            <li class="page-item disabled">
              <a class="page-link">Previous</a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
              <a class="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* :class="{ 'grayscale text-muted': !u.verified || u.deleted }" */
.grayscale {
  filter: grayscale(100);
}
</style>
