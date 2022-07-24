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
import { pickBy } from 'lodash-es';

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
const alert = reactive({
  type: '',
  msg: '',
});
const loading = ref(false);
const today = dayjs().format('YYYY/MM/DD');
const random_uuid = ref(uuidv4());
const total = ref('');
const sid = ref(null);
const currentSessionDetails = reactive({});

const chooseExercises = ref([]);
const chooseCategories = ref([]);
const chooseExerciseCategoryId = ref(null);
const chooseExerciseId = ref(null);
const addAExerciseLoading = ref(false);
const addAExerciseNoteLoading = ref(false);

const set = reactive({
  exercise_name: null,
  reps: null,
  rpe: null,
  weight: null,
  notes: null,
});
const addASetLoading = ref(false);
const addASetExerciseId = ref(null);
const addASetExerciseIndex = ref(null);
const addASetDismissButton = ref(null);
const addASetEnableDisableOtherFields = ref(false);

// watches
//  update exercise db as changes in categories
watch(chooseExerciseCategoryId, async (currentValue, oldValue) => {
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
  currentSessionDetails.logs = s.logs || [];

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
  try {
    addAExerciseLoading.value = true;

    if (currentSessionDetails?.logs) {
      for (const e of currentSessionDetails.logs) {
        if (e.exercise_id === chooseExerciseId.value) {
          throw new Error('Exercise already exist within current session!');
        }
      }
    }

    if (currentSessionDetails?.json?.logs) {
      for (const e of currentSessionDetails.json.logs) {
        if (e.exercise_id === chooseExerciseId.value) {
          throw new Error('Exercise already exist within current session!');
        }
      }
    }

    const [exercise] = await getUserExerciseDetails(chooseExerciseId.value);

    const meta = {
      user_id: userStore.user.id,
      object: 'exercises',
      object_id: exercise.id,
      json: JSON.stringify({
        exercise_id: exercise.id,
        session_id: currentSessionDetails.id,
        collapsed: true,
        notes: '',
        sets: [],
      }),
    };

    const res = await api.post(`/api/v1/gains-meta`, meta);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    addAExerciseLoading.value = false;
    clearDataAndDismissAddAExerciseModal();

    currentSessionDetails.logs.push({
      name: exercise.name,
      exercise_id: exercise.id,
      session_id: currentSessionDetails.id,
      gains_meta_id: json.data[0].id,
      collapsed: true,
      notes: '',
      sets: [],
    });

    const ress = await api.patch(`/api/v1/sessions/${currentSessionDetails.id}`, {
      user_id: userStore.user.id,
      json: JSON.stringify({ logs: currentSessionDetails.logs }),
    });
    const jsons = await ress.json();

    if (!ress.ok) {
      if (jsons.errors) {
        throw jsons.errors;
      } else {
        throw jsons.message;
      }
    }
  } catch (e) {
    loading.value = false;
    addAExerciseLoading.value = false;
    clearDataAndDismissAddAExerciseModal();
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearDataAndDismissAddAExerciseModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`add-a-exercise`));
  modal.hide();
}

async function handleAddASet() {
  try {
    addASetLoading.value = true;

    const setData = {
      user_id: userStore.user.id,
      exercise_id: addASetExerciseId.value,
      session_id: currentSessionDetails.id,
      reps: set.reps,
      weight: set.weight,
      rpe: set.rpe,
      notes: set.notes,
    };

    const validSetData = pickBy(setData, (value, key) => value !== null);

    const res = await api.post(`/api/v1/sets`, validSetData);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    addASetLoading.value = false;

    clearDataAndDismissAddASetModal();

    // if .logs not available, we push to .json
    if (currentSessionDetails.logs?.length === 0) {
      currentSessionDetails.json.logs[addASetExerciseIndex.value].sets.push(setData);
    } else {
      currentSessionDetails.logs[addASetExerciseIndex.value].sets.push(setData);
    }
  } catch (e) {
    loading.value = false;
    addASetLoading.value = false;
    clearDataAndDismissAddASetModal();
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearDataAndDismissAddASetModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById(`add-a-set-${random_uuid.value}`),
  );
  modal.hide();
}

async function handleCompleteCurrentSession() {
  try {
    const body = {
      end_date: gainsCurrentDateTime(),
      user_id: userStore.user.id,
      // json: JSON.stringify(currentSessionDetails.logs),
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

async function handleAddAExerciseNote() {
  try {
    addAExerciseNoteLoading.value = true;

    let gains_meta_id = null;
    if (currentSessionDetails.logs?.length === 0) {
      gains_meta_id = currentSessionDetails.json.logs[addASetExerciseIndex.value].gains_meta_id;
    } else {
      gains_meta_id = currentSessionDetails.logs[addASetExerciseIndex.value].gains_meta_id;
    }

    const data = {
      user_id: userStore.user.id,
      exercise_id: addASetExerciseId.value,
      session_id: currentSessionDetails.id,
      gains_meta_id: gains_meta_id,
      notes: set.notes,
    };

    const res = await api.patch(
      `/api/v1/exercises/${data.exercise_id}/sessions/${data.session_id}/update-exercise-note/${data.gains_meta_id}`,
      data,
    );
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    addAExerciseNoteLoading.value = false;
    if (currentSessionDetails.logs?.length === 0) {
      currentSessionDetails.json.logs[addASetExerciseIndex.value].notes = json.data[0].json.notes;
    } else {
      currentSessionDetails.logs[addASetExerciseIndex.value].notes = json.data[0].json.notes;
    }
    clearDataAndDismissAddAExerciseNoteModal();
  } catch (e) {
    addAExerciseNoteLoading.value = false;
    clearDataAndDismissAddAExerciseNoteModal();
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearDataAndDismissAddAExerciseNoteModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById(`add-a-note-${random_uuid.value}`),
  );
  modal.hide();
}

function buildClassName(name, index) {
  return name.split(' ').join('-') + `-${index}`;
}

async function handleDeleteSession() {
  try {
    appStore.loading = true;

    const res = await api.delete(`/api/v1/sessions/${currentSessionDetails.id}`, {
      user_id: userStore.user.id,
    });
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    appStore.loading = false;

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

                  <!-- calories_prior_session -->
                  <span v-if="currentSessionDetails.calories_prior_session">
                    <i class="bi bi-fire me-1"></i>Calories:
                    <span class="fw-light"
                      >{{ currentSessionDetails.calories_prior_session }} kcal
                    </span>
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

                  <!-- block -->
                  <span v-if="currentSessionDetails.block_name">
                    <i class="bi bi-clipboard2-data-fill me-1"></i>Block:
                    <span class="fw-light">{{ currentSessionDetails.block_name }}</span>
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
            <small
              v-if="!currentSessionDetails.end_date"
              class="fst-italic d-flex align-items-center"
            >
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

        <!-- exercise logs -->
        <TransitionGroup
          enter-active-class="animate__animated animate__faster animate__fadeInDown"
          leave-active-class="animate__animated animate__faster animate__fadeInUp"
        >
          <div
            v-for="(log, index) in currentSessionDetails.logs?.length != 0
              ? currentSessionDetails.logs
              : currentSessionDetails.json?.logs"
            :key="`key-${log.index}`"
            class="card p-0"
          >
            <!-- individual exercises log -->
            <div class="card-body">
              <!-- header -->
              <h5 class="card-title d-flex justify-content-between align-items-center mb-0">
                <!-- title -->
                <span>{{ index + 1 }}. {{ log.name }}</span>

                <!-- options -->
                <span class="d-flex gap-2">
                  <!-- show/hide button -->
                  <button
                    @click="log.collapsed = !log.collapsed"
                    class="p-0 m-0"
                    style="background: none; border: none; box-shadow: none"
                    role="button"
                  >
                    <i v-if="!log.collapsed" class="bi bi-chevron-down"></i>
                    <i v-if="log.collapsed" class="bi bi-chevron-up"></i>
                  </button>

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
                v-if="log.notes && log.collapsed"
                class="my-2 card-text card-text bg-secondary bg-opacity-10 p-2 border border-1 rounded"
              >
                <small class="fst-italic fw-light">
                  {{ log.notes }}
                </small>
              </p>

              <!-- sets -->
              <small v-if="log.sets.length != 0 && log.collapsed">
                <div :class="{ 'pt-2': log.notes.length === 0 }"></div>
                <!-- spacer if there is no notes-->
                <div class="table-responsive">
                  <table class="table table-sm table-striped table-hover p-0 m-0">
                    <thead>
                      <tr>
                        <th class="text-center" scope="col">Set</th>
                        <th class="text-center" scope="col"></th>
                        <th class="text-center" scope="col">Rep</th>
                        <th class="text-center" scope="col"></th>
                        <th class="text-center" scope="col">Weight</th>
                        <th class="text-start" scope="col">Rpe</th>
                        <th class="text-start" scope="col">Notes</th>
                        <th class="text-start" scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <TransitionGroup
                        enter-active-class="animate__animated animate__faster animate__fadeInDown"
                        leave-active-class="animate__animated animate__faster animate__fadeInUp"
                      >
                        <tr v-for="(s, idx) in log.sets" :key="`key-${s.id}`">
                          <td class="text-center">{{ idx + 1 }}</td>
                          <td class="text-center text-muted">x</td>
                          <td class="text-center">{{ s.reps }}</td>
                          <td class="text-center text-muted">x</td>
                          <td class="text-center">{{ s.weight }}</td>
                          <td class="text-start"><span v-if="s.rpe">@</span>{{ s.rpe }}</td>
                          <td class="text-start text-truncate text-muted fst-italic">
                            <small>{{ s.notes }}</small>
                          </td>
                          <td class="text-end">
                            <small class="d-flex justify-content-between gap-2">
                              <i class="bi bi-pencil"></i>
                              <i class="bi bi-trash text-danger"></i>
                            </small>
                          </td>
                        </tr>
                      </TransitionGroup>
                    </tbody>
                  </table>
                </div>
              </small>
            </div>

            <!-- footer -->
            <div v-if="log.collapsed" class="card-footer">
              <span class="d-flex justify-content-between gap-2">
                <!-- left -->
                <span class="d-flex justify-content-between gap-2">
                  <!-- add a set model button -->

                  <span>
                    <button
                      @click="
                        (addASetExerciseId = log.exercise_id),
                          (addASetExerciseIndex = index),
                          (set.exercise_name = log.name)
                      "
                      type="button"
                      class="btn btn-sm btn-outline-dark"
                      data-bs-toggle="modal"
                      :data-bs-target="`#add-a-set-${random_uuid}`"
                    >
                      <i class="bi bi-plus-circle"></i>
                    </button>
                  </span>

                  <!-- add exercise notes -->
                  <span>
                    <button
                      @click="
                        (addASetExerciseId = log.exercise_id),
                          (addASetExerciseIndex = index),
                          (set.exercise_name = log.name)
                      "
                      type="button"
                      class="btn btn-sm btn-outline-dark"
                      data-bs-toggle="modal"
                      :data-bs-target="`#add-a-note-${random_uuid}`"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                  </span>

                  <!-- add a video group -->
                  <span>
                    <button type="button" class="btn btn-sm btn-outline-dark" disabled>
                      <i class="bi bi-play-circle"></i>
                    </button>
                  </span>
                </span>

                <!-- right -->
                <span class="d-flex justify-content-between gap-2">
                  <button class="btn btn-sm btn-outline-dark" disabled>
                    <i class="bi bi-bar-chart"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-dark" disabled>
                    <i class="bi bi-journal-text"></i>
                  </button>
                </span>
              </span>
            </div>
          </div>
        </TransitionGroup>

        <!-- add a exercise button -->
        <div class="border">
          <!-- model button -->
          <button
            type="button"
            class="btn btn-dark w-100"
            data-bs-toggle="modal"
            data-bs-target="#add-a-exercise"
            :disabled="loading || currentSessionDetails.end_date"
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
                  <h5 class="modal-title">
                    <span> Add a exercise for </span>
                    <span class="fw-light"> {{ currentSessionDetails.name }}</span>
                  </h5>
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

        <!-- cancel or compte session -->
        <div class="btn-group" role="group">
          <!-- complete current session button -->
          <button
            v-if="!currentSessionDetails.end_date"
            @click="handleCompleteCurrentSession()"
            type="button"
            class="btn btn-success"
            :disabled="
              loading || (!currentSessionDetails.logs?.length && addASetExerciseId == null)
            "
          >
            <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!loading"> <i class="bi bi-check-circle-fill"></i> Complete </span>
            <span v-if="loading"> Loading... </span>
          </button>

          <!-- delete current session -->
          <button
            @click="handleDeleteSession()"
            :disabled="loading"
            type="button"
            class="btn btn-danger"
          >
            <span v-if="currentSessionDetails.end_date">
              <i class="bi bi-trash"></i>
              Delete
            </span>
            <span v-if="!currentSessionDetails.end_date">
              <i class="bi bi-x-circle-fill"></i>
              Cancel
            </span>
          </button>
        </div>

        <!-- add a exercise note -->
        <form
          @submit.prevent="handleAddAExerciseNote()"
          class="modal fade px-1 pt-5"
          :id="`add-a-note-${random_uuid}`"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <span>Add a note for </span>
                  <span class="fw-light"> {{ set.exercise_name }}</span>
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <!-- note -->
                <div class="mb-3">
                  <label class="form-label">Note</label>
                  <textarea
                    v-model.trim="set.notes"
                    class="form-control form-control-sm"
                    id="notes-id"
                    rows="3"
                    :disabled="addAExerciseNoteLoading"
                  ></textarea>
                </div>
              </div>

              <!-- footer -->
              <div class="modal-footer">
                <!-- cancel -->
                <button
                  @click="clearDataAndDismissAddAExerciseNoteModal()"
                  v-if="!addAExerciseNoteLoading"
                  type="reset"
                  class="btn btn-outline-danger"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>

                <!-- add -->
                <button type="submit" class="btn btn-dark" :disabled="addAExerciseNoteLoading">
                  <div
                    v-if="addAExerciseNoteLoading"
                    class="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <span v-if="!addAExerciseNoteLoading"> Submit </span>
                  <span v-if="addAExerciseNoteLoading"> Loading... </span>
                </button>
              </div>
            </div>
          </div>
        </form>

        <!-- add a set modal -->
        <form
          @submit.prevent="handleAddASet()"
          class="modal fade px-1 pt-5"
          :id="`add-a-set-${random_uuid}`"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <span> Add a set for </span>
                  <span class="fw-light">{{ set.exercise_name }}</span>
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="row mb-3">
                  <!-- reps -->
                  <div class="col-4">
                    <label for="rep" class="form-label">Rep*</label>
                    <input
                      v-model.number="set.reps"
                      id="rep"
                      class="form-control form-control-sm"
                      min="1"
                      max="30"
                      step="1"
                      type="number"
                      inputmode="numeric"
                      pattern="[1-9]*"
                      required
                      :disabled="addASetLoading"
                    />
                  </div>

                  <!-- weight -->
                  <div class="col-4">
                    <label for="weight" class="form-label">Weight*</label>
                    <input
                      v-model.number="set.weight"
                      id="weight"
                      class="form-control form-control-sm"
                      type="number"
                      inputmode="numeric"
                      pattern="[1-9]*"
                      min="1"
                      required
                      :disabled="addASetLoading"
                    />
                  </div>

                  <!-- rpe -->
                  <div class="col-4">
                    <label for="rpe" class="form-label">Rpe</label>
                    <input
                      v-model.number="set.rpe"
                      id="rpe"
                      class="form-control form-control-sm"
                      min="1"
                      step=".5"
                      max="10"
                      inputmode="numeric"
                      pattern="[1-10]*"
                      type="number"
                      :disabled="addASetLoading"
                    />
                  </div>
                </div>

                <!-- show/hide button for note -->
                <div class="form-check form-switch mb-3">
                  <input
                    v-model="addASetEnableDisableOtherFields"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="add-a-set-enable-disable-note-button"
                  />
                  <label class="form-check-label" for="add-a-set-enable-disable-note-button">
                    <span v-if="!addASetEnableDisableOtherFields">Enable</span>
                    <span v-if="addASetEnableDisableOtherFields">Disable</span>
                    <span> other fields</span>
                  </label>
                </div>

                <!-- note -->
                <div v-if="addASetEnableDisableOtherFields" class="mb-3">
                  <label class="form-label">Set note</label>
                  <textarea
                    v-model.trim="set.notes"
                    class="form-control form-control-sm"
                    id="notes-id"
                    rows="3"
                    :disabled="addASetLoading"
                  ></textarea>
                </div>
              </div>

              <!-- footer -->
              <div class="modal-footer">
                <!-- cancel -->
                <button
                  @click="clearDataAndDismissAddASetModal()"
                  v-if="!addASetLoading"
                  type="reset"
                  class="btn btn-outline-danger"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>

                <!-- add -->
                <button type="submit" class="btn btn-dark" :disabled="addASetLoading">
                  <div v-if="addASetLoading" class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <span v-if="!addASetLoading"> Submit </span>
                  <span v-if="addASetLoading"> Loading... </span>
                </button>
              </div>
            </div>
          </div>
        </form>
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
