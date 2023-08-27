<script setup>
import Backheader from '../../components/dashboard/headers/Backheader.vue';
import api from '../../../../utils/fetch-with-style.js';
import dayjs from 'dayjs';
import { LineChart, useLineChart } from 'vue-chart-3';
import Papa from 'papaparse';

import useUserStore from '../../store/user.store.js';
import useAppStore from '../../store/app.store.js';
import { useRouter } from 'vue-router';

import { orderBy } from 'lodash-es';

import { reactive, computed, ref, onMounted } from 'vue';

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();

const props = defineProps({
  exercise_id: Number,
});

const alert = reactive({
  type: '',
  msg: '',
});

const pagination = reactive({
  perPage: 20,
  currentPage: 1,
  total: -1,
  lastPage: -1,
});

const setsHistory = ref(null);
let exerciseDetails = reactive({});
// eslint-disable-next-line no-unused-vars
const getExerciseDetailsLoading = ref(null);
const notAvailableYet = ref(false);
const searchText = ref('');
const showDetails = ref(false);

onMounted(async () => {
  try {
    appStore.loading = true;
    const json = await getExerciseDetails(pagination.currentPage);

    // empty
    if (json?.data.length === 0) {
      notAvailableYet.value = true;
      throw new Error('No stats available yet!');
    }

    // unauthorized access deny
    if (json.data.length) {
      const user_id = json.data[0]?.user_id;
      if (user_id !== userStore.user.id) {
        return router.push('/dashboard/unauthorized');
      }
    }

    const first = json.data[0];

    Object.assign(exerciseDetails, {
      exercise_id: first.exercise_id,
      category_id: first.exercise_id,
      exercise_name: first.exercise_name,
      category_name: first.category_name,
    });

    pagination.total = Math.floor(json.pagination.total / pagination.perPage);

    appStore.loading = false;
  } catch (e) {
    appStore.loading = false;

    if (notAvailableYet.value === true) {
      alert.type = 'warning';
    } else {
      alert.type = 'danger';
    }

    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
});

// ----------- chart starts
const chartData = computed(() => ({
  labels: orderBy(setsHistory.value, (x) => new Date(x.created_at), ['asc']).map((x) =>
    dayjs(x.created_at).format('MM/DD'),
  ),
  datasets: [
    {
      label: 'e1RM',
      data: orderBy(setsHistory.value, (x) => new Date(x.created_at), ['asc']).map((x) => x.e1RM),
      backgroundColor: '#F5C2C7',
      borderColor: '#DC3545',
    },
    {
      label: 'Volume',
      data: orderBy(setsHistory.value, (x) => new Date(x.created_at), ['asc']).map(
        (x) => x.weight * x.reps,
      ),
      borderColor: '#47b784',
      borderWidth: 3,
    },
  ],
}));

const { lineChartProps } = useLineChart({
  chartData,
});
// ----------- chart end

async function getExerciseDetails(currentPage) {
  try {
    let url = '';

    if (!currentPage) {
      url = `/api/v1/exercises/${props.exercise_id}/history`;
    } else {
      url = `/api/v1/exercises/${props.exercise_id}/history?perPage=${pagination.perPage}&currentPage=${currentPage}`;
    }

    const res = await api.get(url);
    const json = await res.json();
    if (res.status >= 500) {
      throw new Error(
        'The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again later!',
      );
    }
    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    setsHistory.value = json.data;
    setsHistory.value.pagination = json.pagination;

    return json;
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

async function exerciseTable(title, page = null) {
  const json = await getExerciseDetails(page);
  const file = Papa.unparse(json);
  const el = document.createElement('a');
  el.href = 'data:text/csv;charset=utf-8,' + encodeURI(file);
  el.target = '_blank';
  el.download = `${dayjs().format('YYYY-MM-DD-h-mm-A')}--${title}.csv`;
  el.click();
}

function calculateRelativeIntensity(weight, e1rm, nullFormat = '0') {
  return Math.floor((weight / e1rm) * 100) == Infinity
    ? nullFormat
    : `${Math.floor((weight / e1rm) * 100)}%`;
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster"
  >
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert" v-auto-animate>
        <span>{{ alert.msg }}</span>
      </div>

      <!-- card  -->
      <div v-if="!notAvailableYet">
        <h5><i class="bi bi-graph-up-arrow me-2"></i>e1RM Chart</h5>
        <div class="card" style="height: 100%">
          <div class="card-body">
            <LineChart :height="Number(237)" v-bind="lineChartProps" />
          </div>
        </div>
      </div>

      <!-- table -->
      <div v-if="!notAvailableYet">
        <h5><i class="bi bi-table me-2"></i>{{ exerciseDetails.exercise_name }}</h5>
        <div class="card">
          <!-- header -->
          <div class="card-header">
            <span class="d-flex justify-content-between align-items-center gap-2">
              <!-- right -->
              <span class="d-flex justify-content-between align-items-center gap-2">
                <!-- search -->
                <div class="input-group input-group-sm">
                  <input type="text" class="form-control" v-model="searchText" />
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    type="button"
                    :disabled="!searchText.length"
                  >
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </span>

              <!-- left -->
              <span class="d-flex justify-content-between align-items-center gap-2">
                <!-- reset -->
                <button class="btn btn-sm btn-outline-secondary" type="button" disabled>
                  <i class="bi bi-arrow-repeat"></i>
                </button>

                <!-- hide/show details -->
                <button
                  @click="showDetails = !showDetails"
                  class="btn btn-sm btn-outline-secondary"
                  type="button"
                >
                  <i v-if="showDetails" class="bi bi-eye-slash"></i>
                  <i v-else class="bi bi-eye"></i>
                </button>

                <!-- download -->
                <div class="dropdown">
                  <button
                    id="download-exercise-table"
                    data-bs-toggle="dropdown"
                    class="btn btn-sm btn-outline-dark"
                  >
                    <i class="bi bi-download"></i>
                  </button>

                  <!-- dropdown links -->
                  <ul
                    class="dropdown-menu dropdown-menu-end shadow-sm"
                    style="min-width: fit-content"
                  >
                    <!-- current -->
                    <li>
                      <button
                        class="dropdown-item btn-sm"
                        type="button"
                        @click="
                          exerciseTable(
                            `${exerciseDetails.exercise_name.split(' ').join('-')}--page-${
                              pagination.currentPage
                            }`,
                            pagination.currentPage,
                          )
                        "
                      >
                        Current page
                      </button>
                    </li>

                    <!-- all -->
                    <li>
                      <button
                        @click="
                          exerciseTable(
                            `${exerciseDetails.exercise_name.split(' ').join('-')}--all-pages`,
                          )
                        "
                        class="dropdown-item btn-sm"
                        type="button"
                      >
                        All page
                      </button>
                    </li>
                  </ul>
                </div>
              </span>
            </span>
          </div>

          <!-- body -->
          <div class="card-body">
            <div class="table-responsive">
              <small>
                <table class="table table-striped table-hover table-sm p-0 m-0">
                  <thead>
                    <tr>
                      <!-- <th class="align-middle text-center" scope="col">#</th> -->
                      <th class="align-middle text-center" scope="col">Reps</th>
                      <th class="align-middle text-center" scope="col">Weight</th>
                      <th class="align-middle text-center" scope="col">Rpe</th>
                      <th class="align-middle text-center" scope="col">RI</th>
                      <th class="align-middle text-center" scope="col">e1RM</th>
                      <th class="align-middle text-center" scope="col">Volume</th>
                      <th class="align-middle text-center" scope="col">Session</th>
                      <th class="align-middle text-center" scope="col">Video</th>
                      <th class="align-middle text-center" scope="col">Date</th>
                      <th v-if="showDetails" class="align-middle text-center" scope="col">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in setsHistory" :key="s.id">
                      <!-- checkbox -->
                      <!-- <th class="align-middle text-center" scope="row">
                        <input class="form-check-input" type="checkbox" :value="s.id" />
                      </th> -->

                      <td class="align-middle text-center">{{ s.reps }}</td>
                      <td class="align-middle text-center">{{ s.weight }}</td>
                      <td class="align-middle text-center">@{{ s.rpe }}</td>

                      <!-- r% -->
                      <td class="align-middle text-center">
                        {{ calculateRelativeIntensity(s.weight, s.e1RM, '-') }}
                      </td>

                      <!-- e1rm -->
                      <td class="align-middle text-center">{{ s.e1RM === 0 ? '-' : s.e1RM }}</td>

                      <!-- volume -->
                      <td class="align-middle text-center">{{ s.reps * s.weight }}</td>

                      <!-- session details -->
                      <td class="align-middle text-center">
                        <router-link
                          :to="`/dashboard/sessions/${s.session_id}`"
                          class="link-secondary text-decoration-none"
                        >
                          <i class="bi bi-journal-text"></i> {{ s.session_id }}
                        </router-link>
                      </td>

                      <!-- video -->
                      <td class="align-middle text-center">
                        <router-link
                          :to="`/dashboard/videos/${s.session_id}`"
                          class="link-secondary text-decoration-none"
                        >
                          <i class="bi bi-play-circle-fill"></i>
                        </router-link>
                      </td>

                      <!-- date -->
                      <td class="align-middle text-center">
                        {{ dayjs(s.created_at).format('MM/DD') }}
                      </td>

                      <!-- notes -->
                      <td v-if="showDetails" class="align-middle text-center">{{ s.notes }}</td>
                    </tr>
                  </tbody>
                </table>
              </small>
            </div>
          </div>

          <!-- footer -->
          <div v-if="pagination.total != -1" class="card-footer">
            <nav>
              <ul class="pagination pagination-sm justify-content-center my-2">
                <!-- previous -->
                <li
                  class="page-item"
                  :class="{
                    disabled: setsHistory?.pagination?.currentPage === 1,
                  }"
                >
                  <a
                    @click="
                      (pagination.currentPage = pagination.currentPage - 1),
                        getExerciseDetails(pagination.currentPage)
                    "
                    href="#"
                    class="page-link"
                    >Previous</a
                  >
                </li>

                <!-- middle -->
                <li
                  v-for="(p, index) in setsHistory?.pagination?.lastPage"
                  :key="`page-${index}`"
                  class="page-item"
                  :class="{ active: index + 1 === pagination?.currentPage }"
                >
                  <a
                    href="#"
                    class="page-link"
                    @click="
                      (pagination.currentPage = index + 1),
                        getExerciseDetails(pagination?.currentPage)
                    "
                  >
                    {{ index + 1 }}
                  </a>
                </li>

                <!-- next -->
                <li
                  class="page-item"
                  :class="{
                    disabled:
                      setsHistory?.pagination?.lastPage === setsHistory?.pagination?.currentPage,
                  }"
                >
                  <a
                    @click="
                      (pagination.currentPage = pagination.currentPage + 1),
                        getExerciseDetails(pagination.currentPage)
                    "
                    class="page-link"
                    href="#"
                    >Next</a
                  >
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea:focus,
input:focus {
  outline: 0 none !important;
}

.form-control:focus {
  outline: 0 none !important;
  border-color: none !important;
  -webkit-box-shadow: none;
  box-shadow: none;
}

*:focus {
  outline: none !important;
}

.pagination > li > a {
  background-color: white;
  color: #212529;
  cursor: pointer;
}

.pagination > li > a:focus,
.pagination > li > a:hover,
.pagination > li > span:focus,
.pagination > li > span:hover {
  color: #5a5a5a;
  background-color: #eee;
  border-color: #ddd;
  cursor: pointer;
}

.pagination > .active > a {
  color: white;
  background-color: #212529 !important;
  border: solid 1px #212529 !important;
  cursor: pointer;
}

.pagination > .active > a:hover {
  background-color: #212529 !important;
  border: solid 1px #ffffff;
  cursor: pointer;
}
</style>
