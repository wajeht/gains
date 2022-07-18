<script setup>
import DashboardHeader from '../../components/dashboard/DashboardHeader.vue';

import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Chart } from 'chart.js';
import { sleep } from '../../../../utils/helpers.js';
import { isMobile } from '../../../../utils/helpers.js';
import api from '../../../../libs/fetch-with-style.js';
import useUserStore from '../../store/user.store.js';
import dayjs from 'dayjs';

const userStore = useUserStore();
const router = useRouter();
const today = ref(null);
const loading = ref(false);
const alert = reactive({
  type: '',
  msg: '',
});

onMounted(() => {
  // ----------- chart starts
  today.value = dayjs().format('MMMM DD, YYYY');
  const data = {
    type: 'line',
    data: {
      labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      options: {
        responsive: true,
      },
      datasets: [
        {
          label: 'Number of Moons',
          data: [0, 0, 1, 2, 79, 82, 27, 14],
          backgroundColor: 'rgba(54,73,93,.5)',
          borderColor: '#36495d',
          borderWidth: 3,
        },
        {
          label: 'Planetary Mass (relative to the Sun x 10^-6)',
          data: [0.166, 2.081, 3.003, 0.323, 954.792, 285.886, 43.662, 51.514],
          backgroundColor: 'rgba(71, 183,132,.5)',
          borderColor: '#47b784',
          borderWidth: 3,
        },
      ],
    },
  };

  const ctx = document.getElementById('myChart');
  new Chart(ctx, data);
  // ----------- chart ends

  // warn user if they have not update user details
  const { user } = userStore;
  for (const u in user) {
    if (user[u] === null) {
      alert.type = 'warning';
      alert.msg = `Some of user data are not defined. Please update them via Settings > User details`;
    }
  }
});

async function logout() {
  try {
    loading.value = true;

    await sleep(800);

    const res = await api.get('/api/auth/logout');
    const json = await res.json();

    if (!res.ok) {
      loading.value = false;
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    userStore.isLoggedIn = false;
    userStore.clearUserInfo();

    let logoutLink = '/login';
    if (isMobile) {
      logoutLink = '/dashboard/login';
    }

    router.push({ path: logoutLink });
  } catch (e) {
    loading.value = false;
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
  <DashboardHeader />
  <div class="container px-3">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div
        v-if="alert.type"
        :class="`alert-${alert.type}`"
        class="mb-0 alert animate__animated animate__zoomIn animate__faster"
      >
        <span>{{ alert.msg }}</span>
      </div>

      <!-- profile -->
      <div>
        <h5><i class="bi bi-person-fill"></i> Profile</h5>
        <div class="card">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-4 d-flex flex-column justify-content-center align-items-center">
                <img
                  src="https://dummyimage.com/200x200/bdbdbd/000000.jpg"
                  class="img-fluid rounded-circle"
                  alt="..."
                />
              </div>
              <div class="col-8">
                <h5 class="card-title">
                  {{ userStore.user.first_name }} {{ userStore.user.last_name }}
                </h5>
                <h6 class="card-subtitle mb-0 text-muted">@{{ userStore.user.username }}</h6>
                <p class="card-text">{{ today }}</p>
                <!-- logout -->
                <button @click="logout()" class="btn btn-sm btn-danger" :disabled="loading">
                  <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <span v-if="!loading"> Logout </span>
                  <span v-if="loading"> Loading... </span>
                </button>

                <!-- <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> -->
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <!-- bodyweight -->
            <div class="d-flex flex-column align-items-center">
              <small>{{
                userStore.user.weight === null ? '?' : userStore.user.weight + ' lbs.'
              }}</small>
              <small class="text-muted">Bodyweight</small>
            </div>

            <!-- sleep -->
            <div class="d-flex flex-column align-items-center">
              <small> ~ 7 hrs</small>
              <small class="text-muted">Sleep</small>
            </div>

            <!-- rpe -->
            <div class="d-flex flex-column align-items-center">
              <small>~ 7 RPE</small>
              <small class="text-muted">Recovery</small>
            </div>
          </div>
        </div>
      </div>

      <!-- recovery chart -->
      <div>
        <h5><i class="bi bi-activity"></i> Recovery</h5>
        <div class="card" style="height: 100%">
          <div class="card-body">
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </div>

      <!-- recent prs chart -->
      <div>
        <h5><i class="bi bi-graph-up-arrow"></i> Recent PRS</h5>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover table-sm p-0 m-0">
                <thead>
                  <tr>
                    <th class="text-center" scope="col">Date</th>
                    <th class="text-start" scope="col">Lift</th>
                    <th class="text-center" scope="col">Weight</th>
                    <th class="text-center" scope="col">Gain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">2022/01/23</td>
                    <td class="text-start">sumo deadlift</td>
                    <td class="text-center">234</td>
                    <td class="text-center text-success">+50</td>
                  </tr>

                  <tr>
                    <td class="text-center">2022/04/11</td>
                    <td class="text-start">conventional deadlift</td>
                    <td class="text-center">234</td>
                    <td class="text-center text-success">+15</td>
                  </tr>
                  <tr>
                    <td class="text-center">2022/08/01</td>
                    <td class="text-start">block pull</td>
                    <td class="text-center">234</td>
                    <td class="text-center text-success">+44</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- bodyweight -->
      <div>
        <h5><i class="bi bi-table"></i> Bodyweight</h5>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover table-sm p-0 m-0">
                <thead>
                  <tr>
                    <th class="text-center">Date</th>
                    <th class="text-center">Weight</th>
                    <th class="text-center">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">2021/11/03</td>
                    <td class="text-center">185</td>
                    <td class="text-center text-success">+5</td>
                  </tr>

                  <tr>
                    <td class="text-center">2021/11/03</td>
                    <td class="text-center">185</td>
                    <td class="text-center text-danger">-1</td>
                  </tr>
                  <tr>
                    <td class="text-center">2021/11/03</td>
                    <td class="text-center">234</td>
                    <td class="text-center text-success">+2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
