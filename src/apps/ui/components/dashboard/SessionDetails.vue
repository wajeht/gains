<script setup>
// components
import SessionDetailsHeader from '../../components/dashboard/headers/SessionDetailsHeader.vue';
import Loading from '../../components/dashboard/Loading.vue';

// helpers
import api from '../../../../utils/fetch-with-style.js';
import {
  formatToGainsDateLocal,
  gainsDateDisplay,
  gainsCurrentDateTime,
  sleep,
} from '../../../../utils/helpers.js';

// nodejs
import dayjs from 'dayjs';
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
const appStore = useAppStore();

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
const total = ref('');
const sid = ref(null);
const currentSessionDetails = reactive({});

const chooseExercises = ref([]);
const chooseCategories = ref([]);
const chooseExerciseCategoryId = ref(null);
const chooseExerciseId = ref(null);
const addAExerciseLoading = ref(false);
const addAExerciseNoteLoading = ref(false);
const addAExerciseNoteLogId = ref(false);

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
const addASetLogId = ref(null);
const addASetDismissButton = ref(null);
const addASetEnableDisableOtherFields = ref(false);

const modifyASetEnableDisableOtherFields = ref(false);
const modifyASetLoading = ref(false);

const deleteASetLoading = ref(false);

const completeCurrentSessionShowHideOtherFields = ref(false);
const completeCurrentSessionLoading = ref(false);
const deleteCurrentSessionLoading = ref(false);

const uploadAVideoLoading = ref(false);
const uploadAVideoLogId = ref(null);
const uploadAVideoLogIndex = ref(null);
const video = ref(null);

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

  // collapsed/expend all session state
  const isDone = currentSessionDetails.logs.every((log) => log.collapsed == false);
  if (isDone === true) hideOrCollapsedAllLogsState.value = false;
  else hideOrCollapsedAllLogsState.value = true;

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

const hideOrCollapsedAllLogsState = ref(null);
function hideOrCollapsedAllLogs() {
  // if it was a done session, topically everything has collapsed
  const isDone = currentSessionDetails.logs.every((log) => log.collapsed == false);
  if (isDone === true) {
    currentSessionDetails?.logs.forEach((log) => {
      log.collapsed = true;
    });
    hideOrCollapsedAllLogsState.value = true;
    return;
  }

  if (hideOrCollapsedAllLogsState.value === false) {
    currentSessionDetails?.logs.forEach((log) => {
      log.collapsed = true;
    });
    hideOrCollapsedAllLogsState.value = true;
    return;
  }

  currentSessionDetails?.logs.forEach((log) => {
    log.collapsed = false;
  });
  hideOrCollapsedAllLogsState.value = false;
}

// -------------- CRUD ---------------

async function addAExercise() {
  try {
    addAExerciseLoading.value = true;

    // check if exercise exist already
    if (currentSessionDetails?.logs) {
      for (const e of currentSessionDetails.logs) {
        if (e.exercise_id === chooseExerciseId.value) {
          throw new Error('Exercise already exist within current session!');
        }
      }
    }

    const [exercise] = await getUserExerciseDetails(chooseExerciseId.value);

    const logBody = {
      user_id: userStore.user.id,
      session_id: currentSessionDetails.session_id,
      name: exercise.name,
      collapsed: true,
      exercise_id: exercise.id,
      sets_notes_visibility: false,
    };

    const res = await api.post(`/api/v1/logs`, logBody);
    const json = await res.json();

    addAExerciseLoading.value = false;
    clearDataAndDismissAddAExerciseModal();

    const temp = json.data[0];
    temp.sets = [];

    currentSessionDetails.logs.push(temp);
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
      session_id: currentSessionDetails.session_id,
      log_id: addASetLogId.value,
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

    set.reps = null;
    set.rpe = null;
    set.notes = null;
    set.weight = null;
    addASetLogId.value = null;
    addASetLoading.value = false;
    clearDataAndDismissAddASetModal();

    currentSessionDetails.logs[addASetExerciseIndex.value].sets.push(json.data[0]);
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
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`add-a-set`));
  modal.hide();
}

function clearDataAndDismissModifyASetModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`modify-a-set`));
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

    clearDataAndDismissModifyASetModal();
    modifyASetLoading.value = false;
    const current = currentSessionDetails.logs[set.log_index].sets[set.set_index];

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
  currentSessionDetails.end_date = null;
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById(`complete-current-session`),
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

    const data = {
      user_id: userStore.user.id,
      exercise_id: addASetExerciseId.value,
      session_id: currentSessionDetails.session_id,
      lid: addAExerciseNoteLogId.value,
      notes: set.notes,
    };

    const res = await api.patch(
      `/api/v1/exercises/${data.exercise_id}/sessions/${data.session_id}/update-exercise-note/${data.lid}`,
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

    clearDataAndDismissAddAExerciseNoteModal();
    addAExerciseNoteLoading.value = false;

    currentSessionDetails.logs[addASetExerciseIndex.value].notes = json.data[0].notes;
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
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`add-a-note`));
  modal.hide();
}

function buildClassName(name, index) {
  return name.split(' ').join('-') + `-${index}`;
}

async function handleDeleteSession() {
  try {
    deleteCurrentSessionLoading.value = true;

    const res = await api.delete(`/api/v1/sessions/${currentSessionDetails.session_id}`, {
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

    clearDataAndDismissDeleteSessionModal();
    deleteCurrentSessionLoading.value = false;

    router.push('/dashboard/sessions');
    appStore.showToast(`SessionID: ${json.data[0].id} has been deleted!`);
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

function clearDataAndDismissDeleteSessionModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('delete-current-session'),
  );
  modal.hide();
}

async function uploadAVideo() {
  try {
    uploadAVideoLoading.value = true;
    const file = video.value.files[0];

    let formData = new FormData();
    formData.append('video', file);
    formData.append('user_id', userStore.user.id);
    formData.append('session_id', currentSessionDetails.id);

    const data = {
      method: 'POST',
      body: formData,
    };

    const res = await window.fetch(`/api/v1/logs/${uploadAVideoLogId.value}/upload-a-video`, data); // prettier-ignore
    const json = await res.json();

    if (res.status === 403 || res.status === 401) {
      userStore.logOut();
      return;
    }

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    uploadAVideoLoading.value = false;
    clearDataAndDismissUploadAVideoModal();

    currentSessionDetails.logs[uploadAVideoLogIndex.value].videos = [json.data[0]];

    alert.type = 'success';
    alert.msg = 'A video has been uploaded!';
  } catch (e) {
    uploadAVideoLoading.value = false;
    clearDataAndDismissUploadAVideoModal();
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearDataAndDismissUploadAVideoModal() {
  uploadAVideoLoading.value = false;
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('upload-a-video'));
  modal.hide();
}
</script>

<template>
  <!-- loading -->
  <Loading v-if="appStore.loading" />

  <!-- header -->
  <SessionDetailsHeader />

  <!-- session details -->
  <div v-if="!appStore.loading" class="animate__animated animate__zoomIn animate__faster">
    <div class="container px-3">
      <div class="my-3 d-flex flex-column gap-3" v-auto-animate>
        <!-- alert -->
        <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
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
                <span class="d-flex justify-content-between">
                  <h5 class="card-title">
                    {{ currentSessionDetails.name }}
                  </h5>

                  <!-- collapsed/expend all cards -->
                  <h5
                    v-if="currentSessionDetails.logs?.length > 1"
                    @click="hideOrCollapsedAllLogs()"
                    style="cursor: pointer; margin-right: -12px"
                  >
                    <i v-if="!hideOrCollapsedAllLogsState" class="bi bi bi-toggle-off"></i>
                    <i
                      v-if="hideOrCollapsedAllLogsState"
                      class="bi bi bi-toggle-on text-success"
                    ></i>
                  </h5>
                </span>

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
                  <!-- id -->
                  <span>
                    <font-awesome-icon icon="id-badge" class="me-1" />Session ID:
                    <span class="fw-light">{{ currentSessionDetails.session_id }}</span>
                  </span>

                  <!-- sleep -->
                  <span v-if="currentSessionDetails.hours_of_sleep">
                    <font-awesome-icon icon="fa-moon " class="me-1" />Sleep:
                    <span class="fw-light">{{ currentSessionDetails.hours_of_sleep }} hrs</span>
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

                  <!-- weight -->
                  <span v-if="currentSessionDetails.body_weight">
                    <font-awesome-icon icon="fa-weight-scale " class="me-1" />Body weight:
                    <span class="fw-light">{{ currentSessionDetails.body_weight }} lbs</span>
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
        <span v-for="(log, index) in currentSessionDetails.logs" :key="`key-${log.index}`">
          <div class="card p-0" v-auto-animate>
            <!-- individual exercises log -->
            <div class="card-body">
              <span class="m-0 p-0" v-auto-animate>
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
                      v-auto-animate
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

                <!-- video -->
                <div
                  v-if="log.videos?.length && log.collapsed"
                  class="card card-body p-0 m-0 pt-2 pb-1 border-0"
                >
                  <div class="video-wrapper">
                    <video
                      class="video"
                      v-for="v in log.videos"
                      controls
                      preload="none"
                      :poster="v.screenshot_url"
                      :key="`video-key-${v.id}`"
                      playsinline
                    >
                      <source :src="v.video_url" type="video/mp4" />
                    </video>
                  </div>
                </div>

                <!-- notes -->
                <p
                  v-if="log.notes && log.collapsed"
                  class="my-2 card-text card-text bg-secondary bg-opacity-10 p-2 border border-1 rounded"
                  :class="{ 'mb-0': log?.sets?.length === 0 }"
                >
                  <small class="fst-italic fw-light">
                    {{ log.notes }}
                  </small>
                </p>

                <!-- sets -->
                <small v-if="log.sets?.length != 0 && log.collapsed">
                  <div :class="{ 'pt-2': log.notes?.length === 0 || log?.notes === null }"></div>
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
                        <tr v-for="(s, idx) in log.sets" :key="`key-${s.id}`">
                          <td class="text-center">{{ idx + 1 }}</td>
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
                              data-bs-target="#modify-a-set"
                              :disabled="currentSessionDetails.end_date"
                            >
                              <i class="bi bi-pencil-square"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </small>
              </span>
            </div>

            <!-- footer -->
            <div v-if="log?.collapsed" class="card-footer">
              <span class="d-flex justify-content-between gap-2">
                <!-- left -->
                <span class="d-flex justify-content-between gap-2">
                  <!-- add a set model button -->
                  <span>
                    <button
                      @click="
                        (addASetExerciseId = log.exercise_id),
                          (addASetExerciseIndex = index),
                          (addASetLogId = log.id),
                          (set.exercise_name = log.name)
                      "
                      type="button"
                      class="btn btn-sm btn-outline-dark"
                      data-bs-toggle="modal"
                      data-bs-target="#add-a-set"
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
                          (addAExerciseNoteLogId = log.id),
                          (set.exercise_name = log.name),
                          (set.notes = log.notes)
                      "
                      type="button"
                      class="btn btn-sm btn-outline-dark"
                      data-bs-toggle="modal"
                      data-bs-target="#add-a-note"
                      :disabled="currentSessionDetails.end_date"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                  </span>

                  <!-- add a video group -->
                  <span>
                    <button
                      @click="
                        (uploadAVideoLogId = log.id),
                          (set.exercise_name = log.name),
                          (uploadAVideoLogIndex = index)
                      "
                      type="button"
                      class="btn btn-sm btn-outline-dark"
                      data-bs-toggle="modal"
                      data-bs-target="#upload-a-video"
                      :disabled="log.videos?.length || currentSessionDetails.end_date"
                    >
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
        </span>

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
            <i class="bi bi-plus-circle-fill"></i>
            Add a exercise
          </button>
        </div>

        <!-- cancel or compte session -->
        <div class="btn-group" role="group">
          <!-- delete current session -->
          <button
            :disabled="loading"
            type="button"
            class="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#delete-current-session"
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

          <!-- complete current session button -->
          <button
            v-if="!currentSessionDetails.end_date"
            @click="currentSessionDetails.end_date = gainsCurrentDateTime()"
            data-bs-toggle="modal"
            data-bs-target="#complete-current-session"
            type="button"
            class="btn btn-success"
            :class="{ rounded: currentSessionDetails.end_date === null }"
            :disabled="
              loading || (!currentSessionDetails.logs?.length && addASetExerciseId == null)
            "
          >
            <span v-if="!loading"> <i class="bi bi-check-circle-fill"></i> Complete </span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- add a exercise -->
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
              <option
                v-for="category in chooseCategories"
                :value="category.id"
                :key="`key-${category.id}`"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- lift -->
          <div class="mb-3">
            <span class="d-flex gap-1">
              <label for="session-details-select-exercise" class="form-label">Exercise name*</label>
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
              <option
                v-for="exercise in chooseExercises"
                :value="exercise.id"
                :key="`key-${exercise.id}`"
              >
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
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- add -->
          <button
            type="submit"
            class="btn btn-success"
            :disabled="addAExerciseLoading || !chooseExerciseId"
          >
            <div v-if="addAExerciseLoading" class="spinner-border spinner-border-sm" role="status">
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

  <!-- delete current session modal -->
  <form
    @submit.prevent="handleDeleteSession()"
    class="modal fade px-2 py-5"
    id="delete-current-session"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <span v-if="!currentSessionDetails.end_date"> Cancel </span>
            <span v-if="currentSessionDetails.end_date"> Delete </span>
            <span class="fw-light"> session id: {{ currentSessionDetails.id }}</span>
          </h5>
          <button
            @click="clearDataAndDismissDeleteSessionModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p class="mb-0 pb-0 text-center">
            Are you sure you want to
            <span v-if="!currentSessionDetails.end_date"> cancel </span>
            <span v-if="currentSessionDetails.end_date"> delete </span>
            <span class="badge bg-secondary text-white">{{ currentSessionDetails.name }}</span>
            ?
          </p>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissDeleteSessionModal()"
            v-if="!deleteCurrentSessionLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-success" :disabled="deleteCurrentSessionLoading">
            <div
              v-if="deleteCurrentSessionLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!deleteCurrentSessionLoading"
              ><i class="bi bi-check-circle-fill"></i> Confirm
            </span>
            <span v-if="deleteCurrentSessionLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>

  <!-- add a exercise note modal -->
  <form
    @submit.prevent="handleAddAExerciseNote()"
    class="modal fade px-1 pt-5"
    id="add-a-note"
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
          <button v-if="!addAExerciseNoteLoading" type="reset" class="btn btn-outline-danger">
            <font-awesome-icon icon="broom" />
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
            <button type="submit" class="btn btn-success" :disabled="addAExerciseNoteLoading">
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

  <!-- complete current session modal -->
  <form
    @submit.prevent="handleCompleteCurrentSession()"
    class="modal fade px-2 py-5"
    id="complete-current-session"
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
        <div class="modal-body" v-auto-animate>
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

          <!-- End time -->
          <div class="mb-3">
            <label for="complete-current-session-end-date" class="form-label">End time*</label>
            <input
              v-model="currentSessionDetails.end_date"
              id="complete-current-session-end-date"
              class="form-control form-control-sm"
              type="datetime-local"
              required
              :disabled="completeCurrentSessionLoading"
            />
          </div>

          <!-- show/hide button -->
          <div class="form-check form-switch mb-3">
            <input
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
                <label for="complete-current-session-calories_prior_session" class="form-label"
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
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <!-- submit -->
          <button
            type="submit"
            class="btn btn-success"
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
        <div class="modal-body" v-auto-animate>
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
            <font-awesome-icon icon="broom" />
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
              class="btn btn-success"
              :disabled="addASetLoading || !set.reps || !set.weight"
            >
              <div v-if="addASetLoading" class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <span v-if="!addASetLoading"> <i class="bi bi-check-circle-fill"></i> Submit </span>
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
    id="modify-a-set"
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
        <div class="modal-body" v-auto-animate>
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
        <div class="modal-footer d-flex justify-content-between">
          <!-- delete -->
          <button
            v-if="!modifyASetLoading"
            @click="deleteASet()"
            type="button"
            class="btn btn-sm btn-danger"
            :disabled="deleteASetLoading"
          >
            <div v-if="deleteASetLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Deleting...</span>
            </div>
            <span v-if="!deleteASetLoading"> <i class="bi bi-trash"></i> Delete </span>
            <span v-if="deleteASetLoading"> Deleting... </span>
          </button>

          <!-- btn -->
          <div class="btn-group btn-group-sm" role="group">
            <!-- clear -->
            <button
              v-if="!modifyASetLoading && !deleteASetLoading"
              type="reset"
              class="btn btn-outline-danger"
            >
              <font-awesome-icon icon="broom" />
              Clear
            </button>

            <!-- cancel -->
            <button
              v-if="!modifyASetLoading && !deleteASetLoading"
              @click="clearDataAndDismissModifyASetModal()"
              type="reset"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              <i class="bi bi-x-circle"></i>
              Cancel
            </button>

            <!-- modify -->
            <button
              v-if="!deleteASetLoading"
              type="submit"
              class="btn btn-success"
              :disabled="modifyASetLoading"
            >
              <div v-if="modifyASetLoading" class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden"> Updating...</span>
              </div>
              <span v-if="!modifyASetLoading">
                <i class="bi bi-check-circle-fill"></i> Update
              </span>
              <span v-if="modifyASetLoading"> Updating... </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>

  <!-- upload a video modal -->
  <form
    @submit.prevent="uploadAVideo()"
    class="modal fade px-2 py-5"
    id="upload-a-video"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">
            <span> Upload a video for </span>
            <span class="fw-light">{{ set.exercise_name }}</span>
          </h5>
          <button
            @click="clearDataAndDismissUploadAVideoModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body text-center">
          <div>
            <input
              ref="video"
              class="form-control"
              id="video"
              type="file"
              accept="video/*"
              hidden
            />

            <div
              @click="$refs.video.click()"
              class="alert alert-primary d-flex flex-column gap-1 m-0 p-0 py-3 my-1"
              role="button"
            >
              <i class="bi bi-cloud-arrow-up-fill"></i>
              <span> Click here to choose video! </span>
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearDataAndDismissUploadAVideoModal()"
            v-if="!uploadAVideoLoading"
            type="reset"
            class="btn btn-danger"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-success" :disabled="uploadAVideoLoading">
            <div v-if="uploadAVideoLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!uploadAVideoLoading"
              ><i class="bi bi-check-circle-fill"></i> Confirm
            </span>
            <span v-if="uploadAVideoLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.video-wrapper {
  aspect-ratio: 4/4;
  width: auto;
  height: auto;
  overflow: hidden;
}

.video {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.bg-gray {
  background: #f0f1f2;
  color: black !important;
}
</style>
