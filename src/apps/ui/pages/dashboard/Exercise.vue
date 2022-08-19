<script setup>
import Backheader from '../../components/dashboard/headers/Backheader.vue';
import api from '../../../../utils/fetch-with-style.js';
import dayjs from 'dayjs';

import useUserStore from '../../store/user.store.js';
import { useRouter } from 'vue-router';

import { reactive, ref, onMounted } from 'vue';

const useStore = useUserStore();
const router = useRouter();

const props = defineProps({
  exercise_id: Number,
});

const alert = reactive({
  type: '',
  msg: '',
});

const setsHistory = ref(null);
let exerciseDetails = reactive({});

onMounted(async () => {
  const data = await getExerciseDetails();

  // unauthorized access deny
  if (data.length) {
    const user_id = data[0]?.user_id;
    if (user_id !== useStore.user.id) {
      return router.push('/dashboard/unauthorized');
    }
  }

  const first = data[0];

  Object.assign(exerciseDetails, {
    exercise_id: first.exercise_id,
    category_id: first.exercise_id,
    exercise_name: first.exercise_name,
    category_name: first.category_name,
  });

  setsHistory.value = data;
});

async function getExerciseDetails() {
  try {
    const res = await api.get(`/api/v1/exercises/${props.exercise_id}/history`);
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
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert" v-auto-animate>
        <span>{{ alert.msg }}</span>
      </div>

      <!-- card  -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ exerciseDetails.exercise_name }}</h5>
          <p class="card-text">{{ exerciseDetails.category_name }}</p>
          <span>highest max: 111</span>
        </div>
      </div>

      <!-- table -->
      <div class="card">
        <div class="card-header">
          <span class="d-flex justify-content-between">
            <!-- right -->
            <span class="d-flex justify-content-between align-items-center gap-2">
              <!-- title -->
              <h5 class="card-title my-2">{{ exerciseDetails.exercise_name }}</h5>

              <!-- badge -->
              <small class="bg-success rounded text-white px-1 py-0">{{
                exerciseDetails.category_name
              }}</small>
            </span>

            <!-- left -->
            <span class="d-flex justify-content-between align-items-center gap-2">
              <!--  -->
              <button class="btn btn-sm btn-outline-dark d-block">
                <i class="bi bi-journal-text"></i>
              </button>

              <!-- download -->
              <button class="btn btn-sm btn-outline-dark">
                <i class="bi bi-download"></i>
              </button>

              <!-- setting -->
              <button class="btn btn-sm btn-outline-dark">
                <i class="bi bi-gear-fill"></i>
              </button>
            </span>
          </span>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <small>
              <table class="table table-striped table-hover table-sm p-0 m-0">
                <thead>
                  <tr>
                    <th class="align-middle text-center" scope="col">#</th>
                    <th class="align-middle text-center" scope="col">Reps</th>
                    <th class="align-middle text-center" scope="col">Weight</th>
                    <th class="align-middle text-center" scope="col">Rpe</th>
                    <th class="align-middle text-center" scope="col">Session</th>
                    <th class="align-middle text-center" scope="col">Video</th>
                    <th class="align-middle text-center" scope="col">Date</th>
                    <th class="align-middle text-center" scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(s, index) in setsHistory" :key="s.id">
                    <th class="align-middle text-center" scope="row">
                      <input class="form-check-input" type="checkbox" :value="s.id" />
                    </th>
                    <td class="align-middle text-center">{{ s.reps }}</td>
                    <td class="align-middle text-center">{{ s.weight }}</td>
                    <td class="align-middle text-center">@{{ s.rpe }}</td>
                    <td class="align-middle text-center">
                      <router-link
                        :to="`/dashboard/sessions/${s.session_id}`"
                        class="link-secondary text-decoration-none"
                      >
                        <i class="bi bi-journal-text"></i> {{ s.session_id }}
                      </router-link>
                    </td>
                    <td class="align-middle text-center">
                      <router-link
                        :to="`/dashboard/videos/${s.session_id}`"
                        class="link-secondary text-decoration-none"
                      >
                        <i class="bi bi-play-circle-fill"></i>
                      </router-link>
                    </td>
                    <td class="align-middle text-center">
                      {{ dayjs(s.created_at).format('MM/DD') }}
                    </td>
                    <td class="align-middle text-center">{{ s.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </small>
          </div>
        </div>
        <div class="card-footer">
          <nav aria-label="Page navigation example">
            <ul class="pagination pagination-sm justify-content-center my-2">
              <li class="page-item disabled">
                <a class="page-link">Previous</a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
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
  </div>
</template>

<style scoped></style>
