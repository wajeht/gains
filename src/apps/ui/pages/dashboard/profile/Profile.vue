<script setup>
import VideosAndProfileHeader from '../../../components/dashboard/headers/VideosAndProfileHeader.vue';

import { LineChart, useLineChart } from 'vue-chart-3';
import { onMounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../../../utils/fetch-with-style.js';
import useUserStore from '../../../store/user.store.js';
import dayjs from 'dayjs';
import { omit, meanBy } from 'lodash-es';

import useAppStore from '../../../store/app.store.js';
const appStore = useAppStore();

const userStore = useUserStore();
const router = useRouter();
const today = ref(null);
const loading = ref(false);
const followStats = ref([]);
const alert = reactive({
  type: '',
  msg: '',
});

const recovery = ref([]);

const weeklyWeightIn = reactive({});

const recentPrs = reactive({});

async function getMyFollowStats() {
  try {
    const res = await api.get(`/api/v1/users/${userStore.user.id}/followers`);
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
      return;
    }
  }
}

onMounted(async () => {
  try {
    appStore.loading = true;

    // warn user if they have not update user details
    const { user } = userStore;
    for (const u in user) {
      if (user[u] === null) {
        alert.type = 'warning';
        alert.msg = `Some of user data are not defined. Please update them via Settings > User details`;
      }
    }

    // const wwi = await getWeeklyWeightIn();
    // Object.assign(weeklyWeightIn, wwi);

    // let rpr = await getRecentPrs();
    // rpr.map((cur) => (cur.showRecentPrDetails = false));
    // Object.assign(recentPrs, rpr);

    // // recovery
    // const r = await getRecovery();
    // recovery.value = r || [];

    const [wwi, rpr, r, fs] = await Promise.all([
      getWeeklyWeightIn(),
      getRecentPrs(),
      getRecovery(),
      getMyFollowStats(),
    ]);
    Object.assign(weeklyWeightIn, wwi);

    rpr.map((cur) => (cur.showRecentPrDetails = false));
    Object.assign(recentPrs, rpr);

    recovery.value = r || [];

    followStats.value = fs || [];

    appStore.loading = false;
  } catch (e) {
    appStore.loading = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
      return;
    }
  }
});

const averageSleep = computed(() => {
  return meanBy(recovery.value, (i) => i.hours_of_sleep).toFixed(2);
});

async function getRecentPrs() {
  try {
    const res = await api.get(`/api/v1/variables/recent-prs/${userStore.user.id}`);
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
      return;
    }
  }
}

async function getWeeklyWeightIn() {
  try {
    const res = await api.get(`/api/v1/variables/weekly-weight-in/${userStore.user.id}`);
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

async function getRecovery() {
  try {
    const res = await api.get(
      `/api/v1/variables/recovery/${userStore.user.id}?perPage=7&cache=true`,
    );
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

// ----------- chart starts
const chartData = computed(() => ({
  labels: recovery.value?.map((r) => dayjs(r.created_at).format('MM/DD')),
  datasets: [
    {
      label: 'sleep',
      data: recovery.value?.map((r) => r.hours_of_sleep),
      backgroundColor: '#BADBCC',
      borderColor: '#198754',
    },
    {
      label: 'stress',
      data: recovery.value?.map((r) => r.stress_level),
      backgroundColor: '#FFECB5',
      borderColor: '#FFDE7A',
    },
    {
      label: 'session_rpe',
      data: recovery.value?.map((r) => r.session_rpe),
      backgroundColor: '#F5C2C7',
      borderColor: '#DC3545',
    },
  ],
}));

const { lineChartProps } = useLineChart({
  chartData,
});
// ----------- chart end
</script>

<template>
  <VideosAndProfileHeader />

  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster"
  >
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- profile -->
      <div>
        <!-- <h5><i class="bi bi-person-fill"></i> Profile</h5> -->
        <div class="card">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-4 d-flex flex-column justify-content-center align-items-center">
                <span class="image-wrapper">
                  <img
                    :src="
                      userStore.user.profile_picture_url ??
                      `https://dummyimage.com/200x200/bdbdbd/000000.jpg`
                    "
                    class="rounded-circle image"
                  />
                </span>
              </div>
              <!-- style="height: 100%; width: 100%; object-fit: cover; object-position: center 50%" -->
              <div class="col-8">
                <div style="display: flex; justify-content: space-between">
                  <!-- name -->
                  <h5 class="card-title">
                    {{ userStore.user.first_name }} {{ userStore.user.last_name }}
                  </h5>

                  <!-- edit -->
                  <button
                    style="height: fit-content ip !important; width: fit-content !important"
                    type="button"
                    class="btn btn-sm p-0 m-0"
                    @click="router.push('/dashboard/settings/account/user-details')"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                </div>

                <!-- username and birth date -->
                <small class="card-subtitle mb-0 text-muted d-flex gap-2 mb-2">
                  <span> @{{ userStore.user.username }} </span>
                  <!-- <span>{{ userStore.user.birth_date }}</span> -->
                </small>

                <!-- description -->
                <p v-if="userStore.user.bio" class="card-text">{{ userStore.user.bio }}</p>

                <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <!-- sleep -->
            <router-link to="/dashboard/tools/others/recovery">
              <div class="d-flex flex-column align-items-center">
                <small> {{ isNaN(averageSleep) ? '?' : `~ ${averageSleep}` }} hrs</small>
                <small class="text-muted">Sleep</small>
              </div>
            </router-link>

            <!-- followers -->
            <router-link to="/dashboard/profile/following">
              <div class="d-flex flex-column align-items-center">
                <small>{{ followStats[0]?.user?.followers?.length }}</small>
                <small class="text-muted">Followers</small>
              </div>
            </router-link>

            <!-- following -->
            <router-link to="/dashboard/profile/following">
              <div class="d-flex flex-column align-items-center">
                <small>{{ followStats[0]?.user?.followings?.length }}</small>
                <small class="text-muted">Following</small>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- recovery chart -->
      <div>
        <h5 class="d-flex justify-content-between align-items-center">
          <span> <i class="bi bi-activity"></i> Recovery </span>
          <small class="text-muted">~ 7 RPE</small>
        </h5>
        <div class="card" style="height: 100%">
          <div class="card-body">
            <LineChart
              v-if="Object.keys(recentPrs).length"
              :height="Number(237)"
              v-bind="lineChartProps"
            />
            <div v-else class="text-muted text-center fw-light">
              <small> No relevant data available yet! </small>
            </div>
          </div>
        </div>
      </div>

      <!-- recent eprs chart -->
      <div>
        <h5><i class="bi bi-graph-up-arrow"></i> Recent ePRS</h5>
        <div class="card">
          <div class="card-body">
            <small class="p-0 m-0">
              <div v-if="Object.keys(recentPrs).length" class="table-responsive">
                <table class="table table-striped table-hover table-responsive table-sm p-0 m-0">
                  <thead>
                    <tr>
                      <th class="text-start" scope="col">Lift</th>
                      <th class="text-start">Log</th>
                      <th class="text-end" scope="col">e1RM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="pr in recentPrs" :key="`recent-prs-id-${pr.id}`">
                      <tr
                        @click="pr.showRecentPrDetails = !pr.showRecentPrDetails"
                        style="cursor: pointer"
                        class="text-truncate"
                      >
                        <td class="text-start text-truncate">
                          <small class="p-0 m-0">
                            <i v-if="!pr.showRecentPrDetails" class="bi bi-chevron-down"></i>
                            <i v-if="pr.showRecentPrDetails" class="bi bi-chevron-up"></i>
                          </small>
                          {{ pr.name }}
                        </td>
                        <td class="text-start">
                          {{ pr.reps }} reps x {{ pr.weight + ' ' + appStore.unitLabel }} @{{
                            pr.rpe
                          }}
                        </td>
                        <td class="text-end">{{ pr.e1rm + ' ' + appStore.unitLabel }}</td>
                      </tr>
                      <tr v-if="pr.showRecentPrDetails" class="fst-italic">
                        <td colspan="3" class="table-active" style="padding-left: 20px">
                          <small class="p-0 m-0">
                            <pre class="p-0 m-0">{{ omit(pr, 'showRecentPrDetails') }}</pre>
                          </small>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-muted text-center fw-light">
                No relevant data available yet!
              </div>
            </small>
          </div>
        </div>
      </div>

      <!-- bodyweight -->
      <div>
        <h5 class="d-flex justify-content-between align-items-center">
          <span><i class="bi bi-table"></i> Bodyweight</span>
          <small class="text-muted">{{
            userStore.user.weight === null ? '?' : userStore.user.weight + ' lbs./w'
          }}</small>
        </h5>
        <div class="card">
          <div class="card-body">
            <small class="p-0 m-0">
              <div v-if="Object.keys(weeklyWeightIn).length > 0" class="table-responsive">
                <table class="table table-striped table-hover table-sm p-0 m-0">
                  <thead>
                    <tr>
                      <th class="text-start">Date</th>
                      <th class="text-center">Weight</th>
                      <th class="text-center">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in weeklyWeightIn" :key="`key-${log.id}`">
                      <td class="text-start">{{ dayjs(log.date).format('MM/DD') }}</td>
                      <td class="text-center">
                        {{ log.body_weight + ' ' + appStore.unitLabel }}
                      </td>
                      <td
                        class="text-center"
                        :class="{
                          'text-success': !log.trend.toString().startsWith('-'),
                          'text-danger': log.trend.toString().startsWith('-'),
                        }"
                      >
                        {{ log.trend > 0 ? '+' : ''
                        }}{{ log.trend === 0 ? '' : log.trend + ' ' + appStore.unitLabel }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-muted text-center fw-light">
                No relevant data available yet!
              </div>
            </small>
          </div>
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

a:hover {
  color: #191919;
}

.image-wrapper {
  aspect-ratio: 1/1;
  width: auto;
  height: auto;
  overflow: hidden;
}

.image {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
