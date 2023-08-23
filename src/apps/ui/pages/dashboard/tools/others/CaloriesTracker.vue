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

const calories = ref([]);
const pagination = ref({});
const calories_prior_session = ref(null);
const total_calories = ref(null);
const caloriesCheckbox = ref([]);
const checkCaloriesCheckbox = ref(false);

const logACaloriesLoading = ref(false);
const deleteACaloriesLoading = ref(false);

onMounted(async () => {
  const bw = await getAllCaloriesOfAUser();
});

// checkbox
watch(checkCaloriesCheckbox, (prev, cur) => {
  if (prev === true) {
    calories.value.forEach((bw) => {
      caloriesCheckbox.value.push(bw.id);
    });
    return;
  }

  if (prev === false) {
    caloriesCheckbox.value = [];
    return;
  }
});

// ------------------------------ functions ------------------------------

async function downloadTable({
  title,
  currentPage = pagination.value.currentPage,
  perPage = 999999999999999,
} = {}) {
  const json = await getAllCaloriesOfAUser({
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

async function getAllCaloriesOfAUser({ perPage = 25, currentPage = 1, download = false } = {}) {
  try {
    appStore.loading = true;

    const url = `/api/v1/variables/calories/${userStore.user.id}?perPage=${perPage}&currentPage=${currentPage}`;
    const res = await api.get(url);
    const json = await res.json();

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

    calories.value = json.data || [];
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

async function deleteACalories() {
  try {
    deleteACaloriesLoading.value = true;

    const ress = await Promise.all(
      caloriesCheckbox.value.map((body_weight_id) =>
        api.delete(`/api/v1/variables/${body_weight_id}?user_id=${userStore.user.id}`),
      ),
    );

    const jsons = await Promise.all(ress.map((data) => data.json()));

    ress.forEach((res) => {
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

    clearDataAndDismissDeleteACalories();
    deleteACaloriesLoading.value = false;

    caloriesCheckbox.value.forEach((bwck) => {
      calories.value = calories.value.filter((bw) => bw.id != bwck);
    });

    alert.type = 'success';
    alert.msg = `Calories ID (s) ${caloriesCheckbox.value} were removed!`;

    caloriesCheckbox.value = [];
  } catch (e) {
    clearDataAndDismissDeleteACalories();
    deleteACaloriesLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function logACalories() {
  try {
    logACaloriesLoading.value = true;

    const body = {
      user_id: userStore.user.id,
      calories_prior_session: calories_prior_session.value ?? 0,
      total_calories: total_calories.value ?? 0,
    };

    const res = await api.post(`/api/v1/variables`, body);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    logACaloriesLoading.value = false;
    clearDataAndDismissLogACalories();

    calories.value.unshift(json.data[0]);
    calories_prior_session.value = null;
  } catch (e) {
    clearDataAndDismissLogACalories();
    logACaloriesLoading.value = false;
    calories_prior_session.value = null;
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

function clearDataAndDismissLogACalories() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`log-a-calories`));
  modal.hide();
}

function clearDataAndDismissDeleteACalories() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`delete-a-calories`));
  modal.hide();
}

// ------------------------------ chart ------------------------------

const chartData = computed(() => ({
  labels: orderBy(calories.value, (x) => new Date(x.created_at), ['asc']).map((x) =>
    dayjs(x.created_at).format('MM/DD'),
  ),
  datasets: [
    {
      label: 'Calories Prior Session',
      data: orderBy(calories.value, (x) => new Date(x.created_at), ['asc']).map(
        (x) => x.calories_prior_session ?? 0,
      ),
      backgroundColor: '#BADBCC',
      borderColor: '#198854',
    },
    {
      label: 'Total Calories',
      data: orderBy(calories.value, (x) => new Date(x.created_at), ['asc']).map(
        (x) => x.total_calories ?? 0,
      ),
      backgroundColor: '#FFECB5',
      borderColor: '#FFDF7A',
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
          <h5><i class="bi bi-table"></i> Calories Tracker</h5>

          <!-- calories -->
          <div v-if="calories.length" class="card">
            <!-- header -->
            <div class="card-header">
              <span class="d-flex justify-content-between align-items-center gap-2">
                <!-- right -->
                <span class="d-flex justify-content-between align-items-center gap-2">
                  <!-- add -->
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#log-a-calories"
                    class="btn btn-sm btn-outline-dark"
                    type="button"
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>

                  <!-- delete -->
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#delete-a-calories"
                    class="btn btn-sm btn-outline-dark"
                    type="button"
                    :disabled="!caloriesCheckbox.length"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </span>

                <!-- left -->
                <span class="d-flex justify-content-between align-items-center gap-2">
                  <!-- reset -->
                  <button
                    @click="getAllCaloriesOfAUser()"
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
                            v-model="checkCaloriesCheckbox"
                            class="form-check-input input-sm m-0 p-0"
                            type="checkbox"
                          />
                        </th>
                        <th class="align-middle text-center" scope="col">ID</th>
                        <th class="align-middle text-center" scope="col">Calories Prior Session</th>
                        <th class="align-middle text-center" scope="col">Total Calories</th>
                        <th class="align-middle text-center" scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="bw in calories" :key="`body-weight-key-${bw.id}`">
                        <td class="align-middle text-center">
                          <input
                            class="form-check-input input-sm m-0 p-0"
                            type="checkbox"
                            v-model="caloriesCheckbox"
                            :value="bw.id"
                          />
                        </td>
                        <td class="align-middle text-center">{{ bw.id }}</td>
                        <td class="align-middle text-center">
                          {{
                            bw.calories_prior_session === null || bw.calories_prior_session === 0
                              ? ''
                              : bw.calories_prior_session
                          }}
                        </td>
                        <td class="align-middle text-center">
                          {{
                            bw.total_calories === null || bw.total_calories === 0
                              ? ''
                              : bw.total_calories
                          }}
                        </td>
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
                      @click="getAllCaloriesOfAUser({ currentPage: pagination?.currentPage - 1 })"
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
                      @click="getAllCaloriesOfAUser({ currentPage: index + 1 })"
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
                      @click="getAllCaloriesOfAUser({ currentPage: pagination?.currentPage + 1 })"
                      class="page-link"
                      href="#"
                      >Next</a
                    >
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <!-- no calories -->
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

  <!-- log a calories modal -->
  <form
    @submit.prevent="logACalories()"
    class="modal fade px-1 pt-5"
    id="log-a-calories"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Add a calories</h5>
          <button
            @click="clearDataAndDismissLogACalories()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="logACaloriesLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body" v-auto-animate>
          <!-- calories_prior_session -->
          <div class="mb-3">
            <label for="rep" class="form-label">Calories prior session*</label>
            <input
              v-model.number="calories_prior_session"
              id="rep"
              class="form-control form-control-sm"
              min="0"
              max="5000"
              step="1"
              type="number"
              inputmode="numeric"
              pattern="[1-5000]*"
              required
              :disabled="logACaloriesLoading"
            />
          </div>

          <!-- total_calories  -->
          <div class="mb-3">
            <label for="rep" class="form-label"
              >Total calories
              <small class="text-muted fst-italic"> (optional) </small>
            </label>
            <input
              v-model.number="total_calories"
              id="rep"
              class="form-control form-control-sm"
              min="1"
              max="5000"
              step="1"
              type="number"
              inputmode="numeric"
              pattern="[1-5000]*"
              :disabled="logACaloriesLoading"
            />
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissLogACalories()"
            v-if="!logACaloriesLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <!-- add -->
          <button type="submit" class="btn btn-success" :disabled="logACaloriesLoading">
            <div v-if="logACaloriesLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="!logACaloriesLoading"> Submit </span>
            <span v-if="logACaloriesLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>

  <!-- delete a calories modal -->
  <form
    @submit.prevent="deleteACalories()"
    class="modal fade px-1 pt-5"
    id="delete-a-calories"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Delete calories</h5>
          <button
            @click="clearDataAndDismissDeleteACalories()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="deleteACaloriesLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <!-- are you sure -->
          <p class="mb-3 pb-0 text-center">Are you sure you want to delete the following ID (s)?</p>

          <!-- badges -->
          <div
            v-if="caloriesCheckbox.length"
            class="d-flex justify-content-center flex-wrap gap-1 mb-3"
          >
            <div class="badge bg-secondary text-white" v-for="bw in caloriesCheckbox">
              {{ bw }}
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissDeleteACalories()"
            v-if="!deleteACaloriesLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <!-- add -->
          <button type="submit" class="btn btn-success" :disabled="deleteACaloriesLoading">
            <div
              v-if="deleteACaloriesLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="!deleteACaloriesLoading"> Submit </span>
            <span v-if="deleteACaloriesLoading"> Loading... </span>
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
