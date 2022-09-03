<script setup>
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../../utils/fetch-with-style.js';
import useUserStore from '../../../../store/user.store.js';
import useAppStore from '../../../../store/app.store.js';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import { LineChart, useLineChart } from 'vue-chart-3';
import { orderBy } from 'lodash-es';
import { onMounted, computed, ref, reactive } from 'vue';

const userStore = useUserStore();
const appStore = useAppStore();

const alert = reactive({ msg: '', alert: '' });

const bodyweight = ref([]);
const pagination = ref({});

onMounted(async () => {
  const bw = await getAllBodyWeightOfAUser();
});

async function logABodyWeight() {
  console.log('logABodyWeight()');
}

async function getAllBodyWeightOfAUser({ perPage = 25, currentPage = 1 } = {}) {
  try {
    appStore.loading = true;

    const url = `/api/v1/variables/bodyweight/${userStore.user.id}?perPage=${perPage}&currentPage=${currentPage}`;
    const res = await api.get(url);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    bodyweight.value = json.data || [];
    pagination.value = json.pagination || {};

    appStore.loading = false;
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

// ----------- chart starts
const chartData = computed(() => ({
  labels: orderBy(bodyweight.value, (x) => new Date(x.date), ['asc']).map((x) =>
    dayjs(x.date).format('MM/DD'),
  ),
  datasets: [
    {
      label: 'Bodyweight',
      data: orderBy(bodyweight.value, (x) => new Date(x.date), ['asc']).map((x) => x.body_weight),
      backgroundColor: '#BADBCC',
      borderColor: '#198854',
    },
  ],
}));

const { lineChartProps } = useLineChart({
  chartData,
});
// ----------- chart end
</script>

<template>
  <!-- header -->
  <Backheader />

  <div v-if="!appStore.loading" class="animate__animated animate__fadeIn animate__faster">
    <div class="container px-3">
      <div class="my-3 d-flex flex-column gap-3">
        <!-- alert -->
        <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
          <span>{{ alert.msg }}</span>
        </div>

        <!-- card  -->
        <div>
          <h5><i class="bi bi-graph-up-arrow me-2"></i>Chart</h5>
          <div class="card" style="height: 100%">
            <div class="card-body">
              <LineChart :height="Number(237)" v-bind="lineChartProps" />
            </div>
          </div>
        </div>

        <!-- table -->
        <div>
          <h5><i class="bi bi-table me-1"></i>Bodyweight Tracker</h5>
          <div class="card">
            <!-- header -->
            <div class="card-header">
              <span class="d-flex justify-content-between align-items-center gap-2">
                <!-- right -->
                <span class="d-flex justify-content-between align-items-center gap-2">
                  <!-- <h5 class="p-0 m-0"></h5> -->
                </span>

                <!-- left -->
                <span class="d-flex justify-content-between align-items-center gap-2">
                  <!-- add -->
                  <button class="btn btn-sm btn-outline-secondary" type="button">
                    <i class="bi bi-plus-lg"></i>
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
                        <button class="dropdown-item btn-sm" type="button">Current page</button>
                      </li>

                      <!-- all -->
                      <li>
                        <button class="dropdown-item btn-sm" type="button">All page</button>
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
                        <th class="align-middle text-center" scope="col">ID</th>
                        <th class="align-middle text-center" scope="col">Weight</th>
                        <th class="align-middle text-center" scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="bw in bodyweight" :key="`body-weight-key-${bw.id}`">
                        <td class="align-middle text-center">{{ bw.id }}</td>
                        <td class="align-middle text-center">{{ bw.body_weight }}</td>
                        <td class="align-middle text-center">
                          {{ dayjs(bw.date).format('YYYY/MM/DD') }}
                        </td>
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
                      disabled: pagination?.currentPage === 1,
                    }"
                  >
                    <a
                      @click="getAllBodyWeightOfAUser({ currentPage: pagination?.currentPage - 1 })"
                      href="#"
                      class="page-link"
                      >Previous</a
                    >
                  </li>

                  <!-- middle -->
                  <li
                    v-for="(p, index) in pagination?.lastPage"
                    :key="`page-${index}`"
                    class="page-item"
                    :class="{ active: index + 1 === pagination?.currentPage }"
                  >
                    <a
                      @click="getAllBodyWeightOfAUser({ currentPage: index + 1 })"
                      href="#"
                      class="page-link"
                    >
                      {{ index + 1 }}
                    </a>
                  </li>

                  <!-- next -->
                  <li
                    class="page-item"
                    :class="{
                      disabled: pagination?.lastPage === pagination?.currentPage,
                    }"
                  >
                    <a
                      @click="getAllBodyWeightOfAUser({ currentPage: pagination?.currentPage + 1 })"
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
  </div>
</template>

<style scoped>
.pagination > li > a {
  background-color: white;
  color: #212529;
  cursor: pointer;
}

.pagination > li > a:focus,
.pagination > li > a:hover,
.pagination > li > span:focus,
.pagination > li > span:hover {
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
