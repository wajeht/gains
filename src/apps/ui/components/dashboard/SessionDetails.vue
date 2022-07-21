<script setup>
// components
import SessionDetailsHeader from '../../components/dashboard/headers/SessionDetailsHeader.vue';
import Loading from '../../components/dashboard/Loading.vue';

// helpers
import api from '../../../../libs/fetch-with-style.js';
import {
  formatToGainsDateLocal,
  gainsDateDisplay,
  gainsCurrentDateTime,
  sleep,
} from '../../../../utils/helpers.js';

// nodejs
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

// vue
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// stores
import useUserStore from '../../store/user.store.js';
import useAppStore from '../../store/app.store.js';

// vue use
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const appStore = useUserStore();

// props
const props = defineProps({
  sid: Number,
});

// data
const loading = ref(false);
const addAExerciseLoading = ref(false);
const alert = reactive({
  type: '',
  msg: '',
});

const today = dayjs().format('YYYY/MM/DD');

const addASetDismissButton = ref(null);
const random_uuid = ref(uuidv4());

const set = reactive({
  exercise_id: null,
  reps: null,
  rpe: null,
  weight: null,
  user_id: null,
  notes: null,
});

const chooseExercises = ref([]);
const chooseCategories = ref([]);
const chooseExerciseCategoryId = ref(null);
const chooseExerciseId = ref(null);

const sid = ref(null);
const currentSessionDetails = reactive({});

const total = ref('');

// watches
//  update exercise db as changes in categories
watch(chooseExerciseCategoryId, async (currentValue, oldValue) => {
  // console.log(currentValue, 'cur');
  // console.log(oldValue, 'old');
  const uec = await getUserExerciseByCategoryId(currentValue);
  chooseExercises.value = uec || [];
});

// mounts
onMounted(async () => {
  appStore.loading = true;

  // initialized current session details on load
  sid.value = route.params.sid;
  const s = await getCurrentSessionDetails();
  Object.assign(currentSessionDetails, s);

  // calculate total date format on load
  const start_date = dayjs(currentSessionDetails.start_date);
  const end_date = dayjs(currentSessionDetails.end_date);
  total.value = end_date.diff(start_date, 'minute');

  // initialized categories on load
  const uec = await getUserExerciseCategories();
  chooseCategories.value = uec || [];

  appStore.loading = false;
});

// functions
async function getCurrentSessionDetails() {
  try {
    const res = await api.get(`/api/v1/sessions/${sid.value}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    const [result] = json.data;

    return result;
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

async function getUserExerciseCategories() {
  try {
    const res = await api.get(`/api/v1/exercise-categories?user_id=${userStore.user.id}`);
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

async function getUserExerciseByCategoryId(ecid) {
  try {
    const res = await api.get(`/api/v1/exercises?exercise_category_id=${ecid}`);
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

async function getUserExerciseDetails(eid) {
  try {
    const res = await api.get(`/api/v1/exercises/${eid}`);
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

async function addAExercise() {
  addAExerciseLoading.value = true;

  const [exercise] = await getUserExerciseDetails(chooseExerciseId.value);

  currentSessionDetails.logs.push(exercise);

  addAExerciseLoading.value = false;

  clearDataAndDismissAddAExerciseModal();
}

function clearDataAndDismissAddAExerciseModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`add-a-exercise`));
  modal.hide();
}

function handleAddASet() {
  addASetDismissButton.value.click();
}

async function handleCompleteCurrentSession() {
  try {
    const body = {
      end_date: gainsCurrentDateTime(),
      user_id: userStore.user.id,
    };

    loading.value = true;

    const res = await api.patch(`/api/v1/sessions/${sid.value}`, body);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    await sleep(1000);

    loading.value = false;

    router.push('/dashboard/sessions');
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

function buildClassName(name, index) {
  return name.split(' ').join('-') + `-${index}`;
}
</script>

<template>
  <!-- loading -->
  <Loading v-if="appStore.loading" />

  <!-- header -->
  <SessionDetailsHeader />

  <!-- session details -->
  <XyzTransition v-if="!appStore.loading" appear xyz="fade small out-down">
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

        <!-- sessions card -->
        <div class="card p-0">
          <div class="card-body">
            <div class="row mx-0">
              <div
                :class="{
                  'bg-gray': currentSessionDetails.session_rpe === null,

                  'bg-success':
                    currentSessionDetails.session_rpe >= 1 &&
                    currentSessionDetails.session_rpe <= 7.5,

                  'bg-danger':
                    currentSessionDetails.session_rpe >= 8 &&
                    currentSessionDetails.session_rpe <= 10,
                }"
                class="col-4 text-white rounded d-flex justify-content-center align-items-center border border-1 rounded"
              >
                <span>{{ currentSessionDetails.session_rpe ?? '?' }}</span>
              </div>
              <div class="col-8">
                <!-- title -->
                <h5 class="card-title">{{ currentSessionDetails.name }}</h5>

                <!-- notes -->
                <p
                  v-if="currentSessionDetails.notes"
                  class="card-text bg-secondary bg-opacity-10 p-2 border border-1 rounded mb-2"
                >
                  <small class="fst-italic fw-light">
                    {{ currentSessionDetails.notes }}
                  </small>
                </p>

                <!-- icons group -->
                <small class="card-text card-text d-flex flex-column">
                  <!-- sleep -->
                  <span v-if="currentSessionDetails.hours_of_sleep">
                    <font-awesome-icon icon="fa-moon " class="me-1" />Sleep:
                    <span class="fw-light">{{ currentSessionDetails.hours_of_sleep }} hrs</span>
                  </span>

                  <!-- weight -->
                  <span v-if="currentSessionDetails.body_weight">
                    <font-awesome-icon icon="fa-weight-scale " class="me-1" />Weight:
                    <span class="fw-light">{{ currentSessionDetails.body_weight }} lbs</span>
                  </span>

                  <!-- caffeine -->
                  <span v-if="currentSessionDetails.caffeine_intake">
                    <font-awesome-icon icon="fa-mug-hot " class="me-1" />Caffeine:
                    <span class="fw-light">{{ currentSessionDetails.caffeine_intake }} mg</span>
                  </span>

                  <!-- block -->
                  <span v-if="currentSessionDetails.block_name">
                    <i class="bi bi-clipboard2-data-fill me-1"></i>Block:
                    <span class="fw-light">{{ currentSessionDetails.block_name }}</span>
                  </span>

                  <!-- start time -->
                  <span v-if="currentSessionDetails.start_date">
                    <font-awesome-icon icon="fa-clock" class="me-1" />Start:
                    <span class="fw-light">{{
                      dayjs(currentSessionDetails.start_date).format('h:mm A')
                    }}</span>
                  </span>

                  <!-- end time -->
                  <span v-if="currentSessionDetails.end_time">
                    <font-awesome-icon icon="fa-clock" class="me-1" />End:
                    <span class="fw-light">{{
                      dayjs(currentSessionDetails.end_time).format('h:mm A')
                    }}</span>
                  </span>

                  <!-- total -->
                  <span v-if="total">
                    <font-awesome-icon icon="fa-plus" class="me-1" />Total:
                    <span class="fw-light">{{ total }} min</span>
                  </span>
                </small>
              </div>
            </div>
          </div>

          <small class="card-footer text-muted d-flex justify-content-between align-items-center">
            <!-- date -->
            <small>
              <font-awesome-icon icon="fa-calendar " class="me-1" />Date:
              <span class="fw-light">{{ gainsDateDisplay(currentSessionDetails.created_at) }}</span>
            </small>

            <!-- incomplete or progress -->
            <small class="fst-italic d-flex align-items-center">
              <!-- danger -->
              <!-- prettier-ignore -->
              <span v-if="currentSessionDetails.end_date === null && dayjs(currentSessionDetails.start_date).format('YYYY/MM/DD') === today" class="text-warning">
                <font-awesome-icon icon="fa-refresh" class="me-1" /> session in progress
              </span>

              <!-- danger -->
              <!-- prettier-ignore -->
              <span v-if="currentSessionDetails.end_date === null && dayjs(currentSessionDetails.start_date).format('YYYY/MM/DD') < today" class="text-danger">
                  <i class="bi bi-exclamation-triangle-fill text-danger"></i> session incomplete
              </span>
            </small>
          </small>
        </div>

        <!-- logs -->
        <div v-for="(log, index) in currentSessionDetails.logs" class="card p-0">
          <div class="card-body">
            <!-- header -->
            <h5 class="card-title d-flex justify-content-between align-items-center mb-0">
              <!-- title -->
              <span>{{ index + 1 }}. {{ log.name }}</span>

              <!-- options -->
              <span class="d-flex gap-2">
                <!-- show/hide button -->
                <button
                  class="accordion-button collapsed p-0 m-0"
                  style="background: none; border: none; box-shadow: none"
                  role="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`.${buildClassName(log.name, index)}`"
                ></button>

                <!-- lift settings -->
                <div class="dropdown">
                  <!-- setting icons -->
                  <a
                    class="link-dark"
                    role="button"
                    id="session-details-setting-button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    ><i class="bi bi-three-dots-vertical"></i
                  ></a>

                  <!-- setting links -->
                  <ul class="dropdown-menu dropdown-menu-end" style="min-width: fit-content">
                    <li><button class="dropdown-item btn-sm" type="button">Edit</button></li>
                    <li><button class="dropdown-item btn-sm" type="button">Delete</button></li>
                  </ul>
                </div>
              </span>
            </h5>

            <!-- notes -->
            <p
              v-if="log.notes"
              :class="buildClassName(log.name, index)"
              class="my-2 accordion-collapse collapse card-text card-text bg-secondary bg-opacity-10 p-2 border border-1 rounded"
            >
              <small class="fst-italic fw-light">
                {{ log.notes }}
              </small>
            </p>

            <!-- sets -->
            <small v-if="log.sets">
              <div
                :class="buildClassName(log.name, index)"
                class="accordion-collapse collapse table-responsive"
              >
                <table class="table table-sm table-striped table-hover p-0 m-0">
                  <thead>
                    <tr>
                      <th class="text-center" scope="col">Set</th>
                      <th class="text-center" scope="col"></th>
                      <th class="text-center" scope="col">Rep</th>
                      <th class="text-center" scope="col"></th>
                      <th class="text-center" scope="col">Weight</th>
                      <th class="text-start" scope="col"></th>
                      <th class="text-start" scope="col">Rpe</th>
                      <th class="text-start" scope="col">Notes</th>
                      <th class="text-start" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(s, idx) in log.sets">
                      <th class="text-center">{{ idx + 1 }}</th>
                      <td class="text-center">x</td>
                      <td class="text-center">{{ s.reps }}</td>
                      <td class="text-center">x</td>
                      <td class="text-center">{{ s.weight }}</td>
                      <td class="text-start">@</td>
                      <td class="text-start">{{ s.rpe }}</td>
                      <td class="text-start text-truncate">
                        <small>{{ s.notes }}</small>
                      </td>
                      <td class="text-end">
                        <small class="d-flex justify-content-between gap-2">
                          <i class="bi bi-pencil"></i>
                          <i class="bi bi-trash"></i>
                        </small>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </small>
          </div>

          <!-- footer -->
          <div
            :class="buildClassName(log.name, index)"
            class="card-footer accordion-collapse collapse"
          >
            <span class="d-flex justify-content-between gap-2">
              <!-- left -->
              <span class="d-flex justify-content-between gap-2">
                <!-- add a set group -->
                <span>
                  <!-- add a set model button -->
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#add-a-set"
                  >
                    <i class="bi bi-plus-circle"></i>
                  </button>

                  <!-- add a set modal -->
                  <form
                    @submit.prevent="handleAddASet()"
                    class="modal fade px-1 pt-5"
                    id="add-a-set"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                  >
                    <div class="modal-dialog modal-dialog-scrollable">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Add a set</h5>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-body">
                          <!-- reps -->
                          <div class="mb-3">
                            <label for="rep" class="form-label">Rep*</label>
                            <input
                              id="rep"
                              class="form-control form-control-sm"
                              type="number"
                              min="1"
                              max="20"
                              step="1"
                              required
                            />
                          </div>

                          <!-- weight -->
                          <div class="mb-3">
                            <label for="weight" class="form-label">Weight*</label>
                            <input
                              id="weight"
                              class="form-control form-control-sm"
                              type="number"
                              min="5"
                              step="5"
                              required
                            />
                          </div>

                          <!-- rpe -->
                          <div class="mb-3">
                            <label for="rpe" class="form-label">Rpe</label>
                            <select id="rpe" class="form-control form-select form-select-sm">
                              <option selected value="" disabled>select a rpe!</option>
                              <option value="5">5</option>
                              <option value="5.5">5.5</option>
                              <option value="6">6</option>
                              <option value="6.5">6.5</option>
                              <option value="7">7</option>
                              <option value="7.5">7.5</option>
                              <option value="8">8</option>
                              <option value="8.5">8.5</option>
                              <option value="9">9</option>
                              <option value="9.5">9.5</option>
                              <option value="10">10</option>
                            </select>
                          </div>

                          <!-- note -->
                          <div class="mb-3">
                            <label class="form-label">Note</label>
                            <textarea
                              class="form-control form-control-sm"
                              id="notes-id"
                              rows="3"
                            ></textarea>
                          </div>
                        </div>

                        <!-- footer -->
                        <div class="modal-footer">
                          <button
                            ref="addASetDismissButton"
                            type="button"
                            class="btn btn-outline-danger"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button type="submit" class="btn btn-dark">Add</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </span>

                <!-- add a video group -->
                <span>
                  <button type="button" class="btn btn-sm btn-outline-dark">
                    <i class="bi bi-play-circle"></i>
                  </button>
                </span>
              </span>

              <!-- right -->
              <span class="d-flex justify-content-between gap-2">
                <button class="btn btn-sm btn-outline-dark">
                  <i class="bi bi-bar-chart"></i>
                </button>
                <button class="btn btn-sm btn-outline-dark">
                  <i class="bi bi-journal-text"></i>
                </button>
              </span>
            </span>
          </div>
        </div>

        <!-- add a exercise button -->
        <div class="border">
          <!-- model button -->
          <button
            type="button"
            class="btn btn-secondary w-100"
            data-bs-toggle="modal"
            data-bs-target="#add-a-exercise"
            :disabled="loading"
          >
            Add a exercise
          </button>

          <!-- modal -->
          <form
            @submit.prevent="addAExercise()"
            class="modal fade px-2 py-5"
            id="add-a-exercise"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Add a exercise</h5>
                  <button
                    @click="clearDataAndDismissAddAExerciseModal()"
                    type="reset"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <!-- exercise category name -->
                  <div class="mb-3">
                    <span class="d-flex gap-1">
                      <label for="session-details-exercise-category-name" class="form-label"
                        >Exercise category name*</label
                      >
                      <span v-tooltip title="Add via categories page!"
                        ><i class="bi bi-question-circle"></i
                      ></span>
                    </span>
                    <select
                      id="session-details-exercise-category-name"
                      class="form-control form-select form-select-sm"
                      v-model="chooseExerciseCategoryId"
                      :disabled="loading || chooseCategories.length === 0"
                      required
                    >
                      <option value="" selected disabled>Select a exercise category!</option>
                      <option v-for="category in chooseCategories" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <!-- lift -->
                  <div class="mb-3">
                    <label for="session-details-select-exercise" class="form-label"
                      >Exercise*</label
                    >
                    <select
                      id="session-details-select-exercise"
                      class="form-control form-select form-select-sm"
                      v-model="chooseExerciseId"
                      :disabled="!chooseExerciseCategoryId || chooseExercises.length === 0"
                      required
                    >
                      <option value="" selected disabled>select a exercise!</option>
                      <option v-for="exercise in chooseExercises" :value="exercise.id">
                        {{ exercise.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- footer -->
                <div class="modal-footer">
                  <!-- cancel -->
                  <button
                    @click="clearDataAndDismissAddAExerciseModal()"
                    v-if="!addAExerciseLoading"
                    type="reset"
                    class="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>

                  <!-- add -->
                  <button
                    type="submit"
                    class="btn btn-dark"
                    :disabled="addAExerciseLoading || !chooseExerciseId"
                  >
                    <div
                      v-if="addAExerciseLoading"
                      class="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <span v-if="!addAExerciseLoading"> Submit </span>
                    <span v-if="addAExerciseLoading"> Loading... </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- complete current session button -->
        <button
          @click="handleCompleteCurrentSession()"
          type="button"
          class="btn btn-success w-100"
          :disabled="loading"
        >
          <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>

          <span v-if="!loading">
            <i class="bi bi-check-circle-fill"></i> Complete current session
          </span>
          <span v-if="loading"> Loading... </span>
        </button>
      </div>
    </div>
  </XyzTransition>
</template>

<style scoped>
.bg-gray {
  background: #f0f1f2;
  color: black !important;
}
</style>
