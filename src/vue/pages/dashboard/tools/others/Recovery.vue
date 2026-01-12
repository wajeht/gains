<script setup>
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../../utils/fetch-with-style.js';
import useUserStore from '../../../../store/user.store.js';
import useAppStore from '../../../../store/app.store.js';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import { LineChart, useLineChart } from 'vue-chart-3';
import { orderBy } from 'lodash-es';
import { onMounted, computed, ref, reactive, watch } from 'vue';

const userStore = useUserStore();
const appStore = useAppStore();

const alert = reactive({ msg: '', type: '' });

const recovery = ref([]);
const pagination = ref({});
const stress_level = ref(null);
const hours_of_sleep = ref(null);

const recoveryCheckbox = ref([]);
const checkRecoveryCheckbox = ref(false);

const logARecoveryLoading = ref(false);
const deleteARecoveryLoading = ref(false);

onMounted(async () => {
  await getRecoveryOfAUser();
});

// checkbox
watch(checkRecoveryCheckbox, (prev, _cur) => {
  if (prev === true) {
    recovery.value.forEach((bw) => {
      recoveryCheckbox.value.push(bw.id);
    });
    return;
  }

  if (prev === false) {
    recoveryCheckbox.value = [];
    return;
  }
});

// ------------------------------ functions ------------------------------

async function downloadTable({
  title,
  currentPage = pagination.value.currentPage,
  perPage = 999999999999999,
} = {}) {
  const json = await getRecoveryOfAUser({
    download: true,
    currentPage,
    perPage,
  });
  const file = Papa.unparse(json);
  const el = document.createElement('a');
  el.href = 'data:text/csv;charset=utf-8,' + encodeURI(file);
  el.target = '_blank';
  el.download = `${dayjs().format('YYYY-MM-DD-h-mm-A')}--${title}.csv`;
  el.click();
}

function printTable() {
  return window.print();
}

// ------------------------------ async functions ------------------------------

async function getRecoveryOfAUser({ perPage = 25, currentPage = 1, download = false } = {}) {
  try {
    appStore.loading = true;

    const url = `/api/v1/variables/recovery/${userStore.user.id}?cache=false&perPage=${perPage}&currentPage=${currentPage}`;
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

    if (download) {
      appStore.loading = false;
      return json.data;
    }

    recovery.value = json.data || [];
    pagination.value = json.pagination || {};

    appStore.loading = false;
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

async function deleteARecovery() {
  try {
    deleteARecoveryLoading.value = true;

    const ress = await Promise.all(
      recoveryCheckbox.value.map((body_weight_id) =>
        api.delete(`/api/v1/variables/${body_weight_id}?user_id=${userStore.user.id}`),
      ),
    );

    const jsons = await Promise.all(ress.map((data) => data.json()));

    ress.forEach((res) => {
      if (res.status >= 500) {
        throw new Error(
          'The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again later!',
        );
      }
      if (!res.ok) {
        jsons.forEach((json) => {
          if (json.errors) {
            throw json.errors;
          } else {
            throw json.message;
          }
        });
      }
    });

    clearDataAndDismissDeleteARecovery();
    deleteARecoveryLoading.value = false;

    recoveryCheckbox.value.forEach((bwck) => {
      recovery.value = recovery.value.filter((bw) => bw.id != bwck);
    });

    alert.type = 'success';
    alert.msg = `Recovery ID (s) ${recoveryCheckbox.value} were removed!`;

    recoveryCheckbox.value = [];
  } catch (e) {
    appStore.loading = false;
    clearDataAndDismissDeleteARecovery();
    deleteARecoveryLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function logARecovery() {
  try {
    logARecoveryLoading.value = true;

    const body = {
      user_id: userStore.user.id,
      stress_level: stress_level.value ?? 0,
      hours_of_sleep: hours_of_sleep.value ?? 0,
    };

    const res = await api.post(`/api/v1/variables`, body);
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

    logARecoveryLoading.value = false;
    clearDataAndDismissLogARecovery();

    recovery.value.unshift(json.data[0]);
    stress_level.value = null;
  } catch (e) {
    appStore.loading = false;
    clearDataAndDismissLogARecovery();
    logARecoveryLoading.value = false;
    stress_level.value = null;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

// ------------------------------ dismiss models ------------------------------

function clearDataAndDismissLogARecovery() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`log-a-recovery`));
  modal.hide();
}

function clearDataAndDismissDeleteARecovery() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`delete-a-recovery`));
  modal.hide();
}

// ------------------------------ chart ------------------------------

const chartData = computed(() => ({
  labels: orderBy(recovery.value, (x) => new Date(x.created_at), ['asc']).map((x) =>
    dayjs(x.created_at).format('MM/DD'),
  ),
  datasets: [
    {
      label: 'Stress Level',
      data: orderBy(recovery.value, (x) => new Date(x.created_at), ['asc']).map(
        (x) => x.stress_level ?? 0,
      ),
      backgroundColor: '#BADBCC',
      borderColor: '#198754',
    },
    {
      label: 'Hours Of Sleep',
      data: orderBy(recovery.value, (x) => new Date(x.created_at), ['asc']).map(
        (x) => x.hours_of_sleep ?? 0,
      ),
      backgroundColor: '#FFECB5',
      borderColor: '#FFDE7A',
    },
    {
      label: 'Session RPE',
      data: orderBy(recovery.value, (x) => new Date(x.created_at), ['asc']).map(
        (x) => x.session_rpe ?? 0,
      ),
      backgroundColor: '#F5C2C7',
      borderColor: '#DC3545',
    },
  ],
}));

const { lineChartProps } = useLineChart({
  chartData,
});
</script>

<template>
  <!-- header -->
  <Backheader />

  <div v-if="!appStore.loading" class="animate__animated animate__fadeIn animate__faster">
    <div class="container px-3">
      <div class="my-3 d-flex flex-column gap-3" v-auto-animate>
        <!-- alert -->
        <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
          <span>{{ alert.msg }}</span>
        </div>

        <!-- chart  -->
        <div>
          <h5><i class="bi bi-graph-up-arrow"></i> Chart</h5>
          <div class="card" style="height: 100%">
            <div class="card-body">
              <LineChart :height="Number(237)" v-bind="lineChartProps" />
            </div>
          </div>
        </div>

        <!-- table -->
        <div>
          <h5><i class="bi bi-table"></i> Recovery Tracker</h5>
          <div v-if="recovery.length" class="card">
            <!-- header -->
            <div class="card-header">
              <span class="d-flex justify-content-between align-items-center gap-2">
                <!-- right -->
                <span class="d-flex justify-content-between align-items-center gap-2">
                  <!-- add -->
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#log-a-recovery"
                    class="btn btn-sm btn-outline-dark"
                    type="button"
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>

                  <!-- delete -->
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#delete-a-recovery"
                    class="btn btn-sm btn-outline-dark"
                    type="button"
                    :disabled="!recoveryCheckbox.length"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </span>

                <!-- left -->
                <span class="d-flex justify-content-between align-items-center gap-2">
                  <!-- reset -->
                  <button
                    @click="getRecoveryOfAUser()"
                    class="btn btn-sm btn-outline-dark"
                    type="button"
                  >
                    <i class="bi bi-arrow-repeat"></i>
                  </button>

                  <!-- print -->
                  <button @click="printTable()" class="btn btn-sm btn-outline-dark" type="button">
                    <i class="bi bi-printer"></i>
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
                          @click="
                            downloadTable({
                              title: `page-${pagination.currentPage}`,
                              currentPage: pagination.currentPage,
                              perPage: pagination.perPage,
                            })
                          "
                          class="dropdown-item btn-sm"
                          type="button"
                        >
                          Current page
                        </button>
                      </li>

                      <!-- all -->
                      <li>
                        <button
                          @click="downloadTable({ title: 'all-pages' })"
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
                        <th class="text-center">
                          <input
                            v-model="checkRecoveryCheckbox"
                            class="form-check-input input-sm m-0 p-0"
                            type="checkbox"
                          />
                        </th>
                        <th class="align-middle text-center" scope="col">ID</th>
                        <th class="align-middle text-center" scope="col">Stress Level</th>
                        <th class="align-middle text-center" scope="col">Hours Of Sleep</th>
                        <th class="align-middle text-center" scope="col">Session RPE</th>
                        <th class="align-middle text-center" scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="bw in recovery" :key="`body-weight-key-${bw.id}`">
                        <td class="align-middle text-center">
                          <input
                            class="form-check-input input-sm m-0 p-0"
                            type="checkbox"
                            v-model="recoveryCheckbox"
                            :value="bw.id"
                          />
                        </td>

                        <!-- id -->
                        <td class="align-middle text-center">{{ bw.id }}</td>

                        <!-- stress -->
                        <td class="align-middle text-center">
                          {{
                            bw.stress_level === null || bw.stress_level === 0 ? '' : bw.stress_level
                          }}
                        </td>

                        <!-- sleep -->
                        <td class="align-middle text-center">
                          {{
                            bw.hours_of_sleep === null || bw.hours_of_sleep === 0
                              ? ''
                              : bw.hours_of_sleep
                          }}
                        </td>

                        <!-- session -->
                        <td class="align-middle text-center">
                          {{
                            bw.session_rpe === null || bw.session_rpe === 0 ? '' : bw.session_rpe
                          }}
                        </td>

                        <!-- date -->
                        <td class="align-middle text-center">
                          {{ dayjs(bw.created_at).format('YYYY/MM/DD') }}
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
                      @click="getRecoveryOfAUser({ currentPage: pagination?.currentPage - 1 })"
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
                      @click="getRecoveryOfAUser({ currentPage: index + 1 })"
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
                      @click="getRecoveryOfAUser({ currentPage: pagination?.currentPage + 1 })"
                      class="page-link"
                      href="#"
                      >Next</a
                    >
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <!-- no recovery -->
          <div v-else class="card">
            <div class="card-body">
              <div class="text-muted text-center fw-light">
                <small> No relevant data available yet! </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- log a recovery modal -->
  <form
    @submit.prevent="logARecovery()"
    class="modal fade px-1 pt-5"
    id="log-a-recovery"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Add a recovery</h5>
          <button
            @click="clearDataAndDismissLogARecovery()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="logARecoveryLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <!-- stress level -->
          <div class="mb-3">
            <label for="rep" class="form-label">stress level*</label>
            <input
              v-model.number="stress_level"
              id="rep"
              class="form-control form-control-sm"
              min="1"
              max="10"
              step="1"
              type="number"
              inputmode="numeric"
              pattern="[1-10]*"
              required
              :disabled="logARecoveryLoading"
            />
          </div>

          <!-- hours of sleep  -->
          <div class="mb-3">
            <label for="rep" class="form-label">Hours of sleep*</label>
            <input
              v-model.number="hours_of_sleep"
              id="rep"
              class="form-control form-control-sm"
              min="1"
              max="24"
              step="1"
              type="number"
              inputmode="numeric"
              pattern="[1-24]*"
              required
              :disabled="logARecoveryLoading"
            />
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissLogARecovery()"
            v-if="!logARecoveryLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <!-- add -->
          <button type="submit" class="btn btn-success" :disabled="logARecoveryLoading">
            <div v-if="logARecoveryLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="!logARecoveryLoading"> Submit </span>
            <span v-if="logARecoveryLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>

  <!-- delete a recovery modal -->
  <form
    @submit.prevent="deleteARecovery()"
    class="modal fade px-1 pt-5"
    id="delete-a-recovery"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Delete recovery</h5>
          <button
            @click="clearDataAndDismissDeleteARecovery()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="deleteARecoveryLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <!-- are you sure -->
          <p class="mb-3 pb-0 text-center">Are you sure you want to delete the following ID (s)?</p>

          <!-- badges -->
          <div
            v-if="recoveryCheckbox.length"
            class="d-flex justify-content-center flex-wrap gap-1 mb-3"
          >
            <div class="badge bg-secondary text-white" v-for="(bw, i) in recoveryCheckbox" :key="i">
              {{ bw }}
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissDeleteARecovery()"
            v-if="!deleteARecoveryLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <!-- add -->
          <button type="submit" class="btn btn-success" :disabled="deleteARecoveryLoading">
            <div
              v-if="deleteARecoveryLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="!deleteARecoveryLoading"> Submit </span>
            <span v-if="deleteARecoveryLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>
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
