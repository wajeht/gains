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

const bodyweight = ref([]);
const pagination = ref({});
const bodyweightInput = ref(null);
const bodyweightCheckbox = ref([]);
const checkBodyweightCheckbox = ref(false);

const logABodyWeightLoading = ref(false);
const deleteABodyWeightLoading = ref(false);

onMounted(async () => {
  const bw = await getAllBodyWeightOfAUser();
});

// checkbox
watch(checkBodyweightCheckbox, (prev, cur) => {
  if (prev === true) {
    bodyweight.value.forEach((bw) => {
      bodyweightCheckbox.value.push(bw.id);
    });
    return;
  }

  if (prev === false) {
    bodyweightCheckbox.value = [];
    return;
  }
});

// ------------------------------ functions ------------------------------

async function downloadTable({
  title,
  currentPage = pagination.value.currentPage,
  perPage = 999999999999999,
} = {}) {
  const json = await getAllBodyWeightOfAUser({
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

async function getAllBodyWeightOfAUser({ perPage = 25, currentPage = 1, download = false } = {}) {
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

    if (download) {
      appStore.loading = false;
      return json.data;
    }

    bodyweight.value = json.data || [];
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

async function deleteABodyWeight() {
  try {
    deleteABodyWeightLoading.value = true;

    const ress = await Promise.all(
      bodyweightCheckbox.value.map((body_weight_id) =>
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

    clearDataAndDismissDeleteABodyWeight();
    deleteABodyWeightLoading.value = false;

    bodyweightCheckbox.value.forEach((bwck) => {
      bodyweight.value = bodyweight.value.filter((bw) => bw.id != bwck);
    });

    alert.type = 'success';
    alert.msg = `Bodyweight ID (s) ${bodyweightCheckbox.value} were removed!`;

    bodyweightCheckbox.value = [];
  } catch (e) {
    appStore.loading = false;
    clearDataAndDismissDeleteABodyWeight();
    deleteABodyWeightLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function logABodyWeight() {
  try {
    logABodyWeightLoading.value = true;

    const body = {
      user_id: userStore.user.id,
      body_weight: bodyweightInput.value,
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

    logABodyWeightLoading.value = false;
    clearDataAndDismissLogABodyWeight();

    bodyweight.value.unshift(json.data[0]);
    bodyweightInput.value = null;
  } catch (e) {
    appStore.loading = false;
    logABodyWeightLoading.value = false;
    bodyweightInput.value = null;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

// dismiss models

function clearDataAndDismissLogABodyWeight() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`log-a-bodyweight`));
  modal.hide();
}

function clearDataAndDismissDeleteABodyWeight() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`delete-a-bodyweight`));
  modal.hide();
}

// ------------------------------ chart ------------------------------
const chartData = computed(() => ({
  labels: orderBy(bodyweight.value, (x) => new Date(x.created_at), ['asc']).map((x) =>
    dayjs(x.created_at).format('MM/DD'),
  ),
  datasets: [
    {
      label: 'Bodyweight',
      data: orderBy(bodyweight.value, (x) => new Date(x.created_at), ['asc']).map(
        (x) => x.body_weight,
      ),
      backgroundColor: '#BADBCC',
      borderColor: '#198854',
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

          <!-- bodyweight -->
          <div v-if="bodyweight.length" class="card">
            <!-- header -->
            <div class="card-header">
              <span class="d-flex justify-content-between align-items-center gap-2">
                <!-- right -->
                <span class="d-flex justify-content-between align-items-center gap-2">
                  <!-- add -->
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#log-a-bodyweight"
                    class="btn btn-sm btn-outline-dark"
                    type="button"
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>

                  <!-- delete -->
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#delete-a-bodyweight"
                    class="btn btn-sm btn-outline-dark"
                    type="button"
                    :disabled="!bodyweightCheckbox.length"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </span>

                <!-- left -->
                <span class="d-flex justify-content-between align-items-center gap-2">
                  <!-- reset -->
                  <button
                    @click="getAllBodyWeightOfAUser()"
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
                            v-model="checkBodyweightCheckbox"
                            class="form-check-input input-sm m-0 p-0"
                            type="checkbox"
                          />
                        </th>
                        <th class="align-middle text-center" scope="col">ID</th>
                        <th class="align-middle text-center" scope="col">Weight</th>
                        <th class="align-middle text-center" scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="bw in bodyweight" :key="`body-weight-key-${bw.id}`">
                        <td class="align-middle text-center">
                          <input
                            class="form-check-input input-sm m-0 p-0"
                            type="checkbox"
                            v-model="bodyweightCheckbox"
                            :value="bw.id"
                          />
                        </td>
                        <td class="align-middle text-center">{{ bw.id }}</td>
                        <td class="align-middle text-center">{{ bw.body_weight }}</td>
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

          <!-- no bodyweight -->
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

  <!-- log a bodyweight modal -->
  <form
    @submit.prevent="logABodyWeight()"
    class="modal fade px-1 pt-5"
    id="log-a-bodyweight"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Add a bodyweight</h5>
          <button
            @click="clearDataAndDismissLogABodyWeight()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="logABodyWeightLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body" v-auto-animate>
          <!-- bodyweight -->
          <label for="rep" class="form-label">Body weight*</label>
          <input
            v-model.number="bodyweightInput"
            id="rep"
            class="form-control form-control-sm"
            min="1"
            max="1000"
            step="1"
            type="number"
            inputmode="numeric"
            pattern="[1-1000]*"
            required
            :disabled="logABodyWeightLoading"
          />
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissLogABodyWeight()"
            v-if="!logABodyWeightLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <!-- add -->
          <button type="submit" class="btn btn-success" :disabled="logABodyWeightLoading">
            <div
              v-if="logABodyWeightLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="!logABodyWeightLoading"> Submit </span>
            <span v-if="logABodyWeightLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>

  <!-- delete a bodyweight modal -->
  <form
    @submit.prevent="deleteABodyWeight()"
    class="modal fade px-1 pt-5"
    id="delete-a-bodyweight"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Delete bodyweight</h5>
          <button
            @click="clearDataAndDismissDeleteABodyWeight()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="deleteABodyWeightLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <!-- are you sure -->
          <p class="mb-3 pb-0 text-center">Are you sure you want to delete the following ID (s)?</p>

          <!-- badges -->
          <div
            v-if="bodyweightCheckbox.length"
            class="d-flex justify-content-center flex-wrap gap-1 mb-3"
          >
            <div class="badge bg-secondary text-white" v-for="bw in bodyweightCheckbox">
              {{ bw }}
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissDeleteABodyWeight()"
            v-if="!deleteABodyWeightLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <!-- add -->
          <button type="submit" class="btn btn-success" :disabled="deleteABodyWeightLoading">
            <div
              v-if="deleteABodyWeightLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="!deleteABodyWeightLoading"> Submit </span>
            <span v-if="deleteABodyWeightLoading"> Loading... </span>
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
