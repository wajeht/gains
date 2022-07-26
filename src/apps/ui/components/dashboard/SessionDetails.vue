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
import { pickBy, pick } from 'lodash-es';

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
  id: null,
  set_index: null,
  log_index: null,
  exercise_id: null,
  user_id: null,
  session_id: null,
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

const modifyASetEnableDisableOtherFields = ref(false);
const modifyASetLoading = ref(false);

const deleteASetLoading = ref(false);

const completeCurrentSessionShowHideOtherFields = ref(false);
const completeCurrentSessionLoading = ref(false);

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
        sets_notes_visibility: false,
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
      sets_notes_visibility: false,
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
      currentSessionDetails.json.logs[addASetExerciseIndex.value].sets.push(json.data[0]);
    } else {
      currentSessionDetails.logs[addASetExerciseIndex.value].sets.push(json.data[0]);
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

function clearDataAndDismissModifyASetModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById(`modify-a-set-${random_uuid.value}`),
  );
  modal.hide();
}

async function modifyASet() {
  try {
    modifyASetLoading.value = true;

    const modifyData = {
      id: set.id,
      user_id: set.user_id,
      exercise_id: set.exercise_id,
      session_id: set.session_id,
      reps: set.reps,
      weight: set.weight,
      rpe: set.rpe,
      notes: set.notes,
    };

    const validModifyData = pickBy(modifyData, (value, key) => value !== null);

    const res = await api.patch(`/api/v1/sets/${modifyData.id}`, validModifyData);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    const current = currentSessionDetails.logs[set.log_index].sets[set.set_index];

    clearDataAndDismissModifyASetModal();
    modifyASetLoading.value = false;

    // update realtime sets
    for (let i in current) {
      current[i] = validModifyData[i];
    }
  } catch (e) {
    loading.value = false;
    modifyASetLoading.value = false;
    clearDataAndDismissModifyASetModal();
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function deleteASet() {
  try {
    deleteASetLoading.value = true;

    const setData = {
      id: set.id,
      user_id: set.user_id,
      session_id: set.session_id,
    };

    const validSetData = pickBy(setData, (value, key) => !value.id);

    const res = await api.delete(`/api/v1/sets/${setData.id}`, validSetData);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    deleteASetLoading.value = false;

    // remove from dom
    currentSessionDetails.logs[set.log_index].sets = currentSessionDetails.logs[
      set.log_index
    ].sets.filter((s, i) => i != set.set_index);

    clearDataAndDismissModifyASetModal();
  } catch (e) {
    loading.value = false;
    deleteASetLoading.value = false;
    clearDataAndDismissModifyASetModal();
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearDataAndDismissCompleteCurrentSessionModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById(`complete-current-session-${random_uuid.value}`),
  );
  modal.hide();
}

async function handleCompleteCurrentSession() {
  try {
    // set end time and user id
    currentSessionDetails.end_date = currentSessionDetails.end_date || gainsCurrentDateTime();
    currentSessionDetails.user_id = userStore.user.id;
    completeCurrentSessionLoading.value = true;

    // filter valid data
    const validData = pick(currentSessionDetails, [
      'user_id',
      'name',
      'block_id',
      'start_date',
      'end_date',
      'body_weight',
      'hours_of_sleep',
      'caffeine_intake',
      'calories_prior_session',
      'session_rpe',
      'notes',
    ]);

    // only sent back non empty data
    const nonEmpty = pickBy(validData, (value, key) => value !== null);

    const res = await api.patch(`/api/v1/sessions/${sid.value}`, nonEmpty);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    completeCurrentSessionLoading.value = false;
    clearDataAndDismissCompleteCurrentSessionModal();

    router.push('/dashboard/sessions');
  } catch (e) {
    completeCurrentSessionLoading.value = false;
    clearDataAndDismissCompleteCurrentSessionModal();
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
                <h5 class="card-title">
                  <span>
                    {{ currentSessionDetails.name }}
                  </span>
                  <span class="text-muted fw-light fs-6">
                    (sid: {{ currentSessionDetails.id }})</span
                  >
                </h5>

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
              <h6 class="card-title d-flex justify-content-between align-items-center mb-0">
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
                      <li>
                        <button class="dropdown-item btn-sm" type="button">Edit</button>
                      </li>
                      <li>
                        <button class="dropdown-item btn-sm" type="button">Delete</button>
                      </li>
                    </ul>
                  </div>
                </span>
              </h6>

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
                        <th class="text-center" scope="col">Rpe</th>

                        <th v-if="log.sets_notes_visibility" class="text-start" scope="col">
                          Notes
                        </th>

                        <th class="text-center" scope="col">
                          <span @click="log.sets_notes_visibility = !log.sets_notes_visibility">
                            <i v-if="!log.sets_notes_visibility" class="bi bi bi-toggle-off"></i>
                            <i
                              v-if="log.sets_notes_visibility"
                              class="bi bi bi-toggle-on text-success"
                            ></i>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <TransitionGroup
                        enter-active-class="animate__animated animate__faster animate__fadeInDown"
                        leave-active-class="animate__animated animate__faster animate__fadeOutUp"
                      >
                        <tr v-for="(s, idx) in log.sets" :key="`key-${s.id}`">
                          <Transition
                            enter-active-class="animate__animated animate__faster animate__fadeInDown"
                            leave-active-class="animate__animated animate__faster animate__fadeInUp"
                          >
                            <td class="text-center">{{ idx + 1 }}</td>
                          </Transition>
                          <td class="text-center text-muted">x</td>
                          <td class="text-center">{{ s.reps }}</td>
                          <td class="text-center text-muted">x</td>
                          <td class="text-center">{{ s.weight }}</td>
                          <td class="text-center"><span v-if="s.rpe">@</span>{{ s.rpe }}</td>

                          <td
                            v-if="log.sets_notes_visibility"
                            class="text-start text-truncate text-muted fst-italic"
                          >
                            <small>{{ s.notes }}</small>
                          </td>

                          <td class="text-center">
                            <!-- modify a set button -->
                            <button
                              @click="
                                (set.id = s.id),
                                  (set.set_index = idx),
                                  (set.log_index = index),
                                  (set.exercise_id = s.exercise_id),
                                  (set.user_id = s.user_id),
                                  (set.session_id = s.session_id),
                                  (set.reps = s.reps),
                                  (set.weight = s.weight),
                                  (set.rpe = s.rpe),
                                  (set.notes = s.notes),
                                  (set.exercise_name = log.name)
                              "
                              type="button"
                              class="btn btn-sm p-0 m-0"
                              data-bs-toggle="modal"
                              :data-bs-target="`#modify-a-set-${random_uuid}`"
                            >
                              <i class="bi bi-pencil-square"></i>
                            </button>
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
                      :disabled="currentSessionDetails.end_date"
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
                      :disabled="currentSessionDetails.end_date"
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
        <div v-if="!currentSessionDetails.end_date" class="border">
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
                  <div v-if="!chooseCategories.length" class="mb-3">
                    <div class="alert alert-warning p-2">
                      <small
                        >Exercise categories must be defined before being able to add new exercises.
                        <router-link
                          @click="clearDataAndDismissAddAExerciseModal()"
                          class="alert-link"
                          to="/dashboard/sessions/categories?model=true"
                          >Click here!</router-link
                        >
                        to add exercise categories!</small
                      >
                    </div>
                  </div>

                  <!-- exercise category name -->
                  <div class="mb-3">
                    <span class="d-flex gap-1">
                      <label for="session-details-exercise-category-name" class="form-label"
                        >Exercise category name*</label
                      >
                      <router-link
                        @click="clearDataAndDismissAddAExerciseModal()"
                        class="alert-link link-secondary"
                        to="/dashboard/sessions/categories?model=true"
                      >
                        <span class="fw-light fst-italic" style="font-size: 0.8rem !important"
                          >Add more</span
                        >
                      </router-link>
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
                    <span class="d-flex gap-1">
                      <label for="session-details-select-exercise" class="form-label"
                        >Exercise name*</label
                      >
                      <router-link
                        @click="clearDataAndDismissAddAExerciseModal()"
                        class="alert-link link-secondary"
                        to="/dashboard/sessions/exercises?model=true"
                      >
                        <span class="fw-light fst-italic" style="font-size: 0.8rem !important"
                          >Add more</span
                        >
                      </router-link>
                    </span>
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
                    <i class="bi bi-x-circle"></i>
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
                    <span v-if="!addAExerciseLoading">
                      <i class="bi bi-check-circle-fill"></i>
                      Submit
                    </span>
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
            data-bs-toggle="modal"
            :data-bs-target="`#complete-current-session-${random_uuid}`"
            type="button"
            class="btn btn-success"
            :disabled="
              loading || (!currentSessionDetails.logs?.length && addASetExerciseId == null)
            "
          >
            <span v-if="!loading"> <i class="bi bi-check-circle-fill"></i> Complete </span>
          </button>

          <!-- complete current session modal -->
          <form
            @submit.prevent="handleCompleteCurrentSession()"
            class="modal fade px-2 py-5"
            :id="`complete-current-session-${random_uuid}`"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">
                    <span> Complete </span>
                    <span class="fw-light"> {{ currentSessionDetails.name }}</span>
                  </h5>
                  <button
                    @click="clearDataAndDismissCompleteCurrentSessionModal()"
                    type="reset"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <!-- session rpe -->
                  <div class="mb-3">
                    <label for="complete-current-session-session-rpe" class="form-label"
                      >Session rpe*</label
                    >
                    <input
                      v-model="currentSessionDetails.session_rpe"
                      id="complete-current-session-session-rpe"
                      class="form-control form-control-sm"
                      type="number"
                      min="1"
                      max="10"
                      step=".5"
                      inputmode="numeric"
                      pattern="[1-10]*"
                      required
                      :disabled="completeCurrentSessionLoading"
                    />
                  </div>

                  <!-- show/hide button -->
                  <div class="form-check form-switch mb-3">
                    <input
                      @click="currentSessionDetails.end_date = gainsCurrentDateTime()"
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="complete-current-session-show-hide-button"
                      v-model="completeCurrentSessionShowHideOtherFields"
                      :disabled="completeCurrentSessionLoading"
                    />
                    <label class="form-check-label" for="complete-current-session-show-hide-button">
                      <span v-if="completeCurrentSessionShowHideOtherFields">Hide</span>
                      <span v-else>Show</span>
                      <span> other fields</span>
                    </label>
                  </div>

                  <span v-if="completeCurrentSessionShowHideOtherFields">
                    <!-- End time -->
                    <div v-if="completeCurrentSessionShowHideOtherFields" class="mb-3">
                      <label for="complete-current-session-end-date" class="form-label"
                        >End time*</label
                      >
                      <input
                        v-model="currentSessionDetails.end_date"
                        id="complete-current-session-end-date"
                        class="form-control form-control-sm"
                        type="datetime-local"
                        required
                        :disabled="completeCurrentSessionLoading"
                      />
                    </div>

                    <div class="row mb-3">
                      <!-- bodyweight  -->
                      <div class="col-6">
                        <label for="complete-current-session-bodyweight" class="form-label"
                          >Bodyweight</label
                        >
                        <input
                          v-model="currentSessionDetails.body_weight"
                          id="complete-current-session-bodyweight"
                          class="form-control form-control-sm"
                          min="1"
                          inputmode="numeric"
                          pattern="[1-10]*"
                          type="number"
                          :disabled="completeCurrentSessionLoading"
                        />
                      </div>

                      <!-- hours of sleep  -->
                      <div class="col-6">
                        <label for="complete-current-session-sleep" class="form-label"
                          >Hours of sleep</label
                        >
                        <input
                          v-model="currentSessionDetails.hours_of_sleep"
                          id="complete-current-session-sleep"
                          class="form-control form-control-sm"
                          min="1"
                          type="number"
                          inputmode="numeric"
                          pattern="[0-24]*"
                          :disabled="completeCurrentSessionLoading"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <!-- calories prior -->
                      <div class="col-6">
                        <label
                          for="complete-current-session-calories_prior_session"
                          class="form-label"
                          >Calories
                        </label>
                        <input
                          v-model="currentSessionDetails.calories_prior_session"
                          id="complete-current-session-calories_prior_session"
                          class="form-control form-control-sm"
                          min="1"
                          type="number"
                          inputmode="numeric"
                          pattern="[1-10000]*"
                          :disabled="completeCurrentSessionLoading"
                        />
                      </div>

                      <!-- caffeine intake -->
                      <div class="col-6">
                        <label for="complete-current-session-caffeine-intake" class="form-label"
                          >Caffeine</label
                        >
                        <input
                          v-model="currentSessionDetails.caffeine_intake"
                          id="complete-current-session-caffeine-intake"
                          class="form-control form-control-sm"
                          min="1"
                          type="number"
                          inputmode="numeric"
                          pattern="[1-10000]*"
                          :disabled="completeCurrentSessionLoading"
                        />
                      </div>
                    </div>

                    <!-- notes -->
                    <div v-if="completeCurrentSessionShowHideOtherFields" class="mb-2">
                      <label for="complete-current-session-notes" class="form-label">Notes</label>
                      <textarea
                        v-model="currentSessionDetails.notes"
                        class="form-control form-control-sm"
                        id="complete-current-session-notes"
                        rows="3"
                        :disabled="completeCurrentSessionLoading"
                      ></textarea>
                    </div>
                  </span>
                </div>

                <!-- footer -->
                <div class="modal-footer">
                  <!-- cancel -->
                  <button
                    @click="clearDataAndDismissCompleteCurrentSessionModal()"
                    v-if="!completeCurrentSessionLoading"
                    type="reset"
                    class="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>

                  <!-- submit -->
                  <button
                    type="submit"
                    class="btn btn-dark"
                    :disabled="
                      completeCurrentSessionLoading ||
                      currentSessionDetails.session_rpe === null ||
                      currentSessionDetails.end_date?.length === 0
                    "
                  >
                    <div
                      v-if="completeCurrentSessionLoading"
                      class="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>

                    <span v-if="!completeCurrentSessionLoading">Submit </span>
                    <span v-if="completeCurrentSessionLoading"> Loading... </span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          <!-- delete current session -->
          <button
            @click="handleDeleteSession()"
            :disabled="loading"
            type="button"
            class="btn btn-danger"
            :class="{ rounded: currentSessionDetails.end_date != null }"
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
                <!-- clear -->
                <button v-if="!addASetLoading" type="reset" class="btn btn-outline-danger">
                  Clear
                </button>

                <div class="btn-group" role="group">
                  <!-- cancel -->
                  <button
                    @click="clearDataAndDismissAddAExerciseNoteModal()"
                    v-if="!addAExerciseNoteLoading"
                    type="reset"
                    class="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    <i class="bi bi-x-circle"></i>
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
                    <span v-if="!addAExerciseNoteLoading">
                      <i class="bi bi-check-circle-fill"></i>
                      Submit
                    </span>
                    <span v-if="addAExerciseNoteLoading"> Loading... </span>
                  </button>
                </div>
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
                      :disabled="addASetLoading || !set.reps"
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
                      :disabled="addASetLoading || !set.weight"
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
                    :disabled="addASetLoading || !set.reps || !set.weight"
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
                <!-- clear -->
                <button v-if="!addASetLoading" type="reset" class="btn btn-outline-danger">
                  Clear
                </button>

                <!-- btn -->
                <div class="btn-group" role="group">
                  <!-- cancel -->
                  <button
                    @click="clearDataAndDismissAddASetModal()"
                    v-if="!addASetLoading"
                    type="reset"
                    class="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    <i class="bi bi-x-circle-fill"></i>
                    Cancel
                  </button>

                  <!-- add -->
                  <button
                    type="submit"
                    class="btn btn-dark"
                    :disabled="addASetLoading || !set.reps || !set.weight"
                  >
                    <div
                      v-if="addASetLoading"
                      class="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <span v-if="!addASetLoading">
                      <i class="bi bi-check-circle-fill"></i> Submit
                    </span>
                    <span v-if="addASetLoading"> Loading... </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <!-- modify a set modal -->
        <form
          @submit.prevent="modifyASet()"
          class="modal fade px-1 pt-5"
          :id="`modify-a-set-${random_uuid}`"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <span> Modify set id {{ set.id }} for </span>
                  <span class="fw-light">{{ set.exercise_name }}</span>
                </h5>
                <button
                  @click="clearDataAndDismissModifyASetModal()"
                  type="reset"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="row mb-3">
                  <!-- reps -->
                  <div class="col-4">
                    <label for="modify-rep" class="form-label">Rep*</label>
                    <input
                      v-model.number="set.reps"
                      id="modify-rep"
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
                    <label for="modify-weight" class="form-label">Weight*</label>
                    <input
                      v-model.number="set.weight"
                      id="modify-weight"
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
                    <label for="modify-rpe" class="form-label">Rpe</label>
                    <input
                      v-model.number="set.rpe"
                      id="modify-rpe"
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
                    v-model="modifyASetEnableDisableOtherFields"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="modify-a-set-enable-disable-note-button"
                  />
                  <label class="form-check-label" for="add-a-set-enable-disable-note-button">
                    <span v-if="!modifyASetEnableDisableOtherFields">Enable</span>
                    <span v-if="modifyASetEnableDisableOtherFields">Disable</span>
                    <span> other fields</span>
                  </label>
                </div>

                <!-- note -->
                <div v-if="modifyASetEnableDisableOtherFields" class="mb-3">
                  <label for="modify-notes-id" class="form-label">Set note</label>
                  <textarea
                    v-model.trim="set.notes"
                    class="form-control form-control-sm"
                    id="modify-notes-id"
                    rows="3"
                    :disabled="modifyASetLoading"
                  ></textarea>
                </div>
              </div>

              <!-- footer -->
              <div class="modal-footer">
                <div class="btn-group" role="group">
                  <!-- clear -->
                  <button
                    v-if="!modifyASetLoading && !deleteASetLoading"
                    type="reset"
                    class="btn btn-outline-danger"
                  >
                    Clear
                  </button>

                  <!-- cancel -->
                  <button
                    v-if="!modifyASetLoading && !deleteASetLoading"
                    @click="clearDataAndDismissModifyASetModal()"
                    type="reset"
                    class="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                  >
                    <i class="bi bi-x-circle-fill"></i>
                    Cancel
                  </button>
                </div>

                <!-- btn -->
                <div class="btn-group" role="group">
                  <!-- delete -->
                  <button
                    v-if="!modifyASetLoading"
                    @click="deleteASet()"
                    type="button"
                    class="btn btn-danger"
                    :disabled="deleteASetLoading"
                  >
                    <div
                      v-if="deleteASetLoading"
                      class="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span class="visually-hidden">Deleting...</span>
                    </div>
                    <span v-if="!deleteASetLoading"> <i class="bi bi-trash"></i> Delete </span>
                    <span v-if="deleteASetLoading"> Deleting... </span>
                  </button>

                  <!-- modify -->
                  <button
                    v-if="!deleteASetLoading"
                    type="submit"
                    class="btn btn-dark"
                    :disabled="modifyASetLoading"
                  >
                    <div
                      v-if="modifyASetLoading"
                      class="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span class="visually-hidden"> Updating...</span>
                    </div>
                    <span v-if="!modifyASetLoading"> Update </span>
                    <span v-if="modifyASetLoading"> Updating... </span>
                  </button>
                </div>
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
