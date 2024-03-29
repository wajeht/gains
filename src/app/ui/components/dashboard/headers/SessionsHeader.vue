<script setup>
import api from '../../../../../utils/fetch-with-style.js';

import { ref, onMounted, reactive, onUnmounted } from 'vue';
import { pickBy } from 'lodash-es';

import dayjs from 'dayjs';

import useUserStore from '../../../store/user.store.js';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const addASessionDismissButton = ref(null);
const showHideOtherFields = ref(false);

const blocks = reactive({
  items: [],
});

const name = ref('');
const start_date = ref('');
const user_id = ref(userStore.user.id);
const caffeine_intake = ref('');
const calories_prior_session = ref('');
const block_id = ref('');
const body_weight = ref('');
const hours_of_sleep = ref('');
const notes = ref('');
const loading = ref(false);

const alert = reactive({
  type: '',
  msg: '',
});

// this code below required for back drop problem fixed when adding a new session header model
onMounted(() => document.body.appendChild(document.getElementById(`add-a-session`)));
onUnmounted(() => document.body.removeChild(document.getElementById(`add-a-session`)));
// this code above required for back drop problem fixed when adding a new session header model

async function gerUserBlocksReady() {
  if (!blocks.items.length) {
    const data = await getUserBlocks();
    blocks.items = data || [];
  }
  start_date.value = dayjs().format('YYYY-MM-DDTHH:mm');
}

async function getUserBlocks() {
  try {
    const res = await api.get(`/api/v1/blocks?user_id=${userStore.user.id}`);
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

async function clearDataAndDismissModal() {
  alert.type = '';
  alert.msg = '';
  name.value = '';
  start_date.value = '';
  user_id.value = userStore.user.id;
  block_id.value = '';
  body_weight.value = '';
  hours_of_sleep.value = '';
  calories_prior_session.value = '';
  caffeine_intake.value = '';
  notes.value = '';
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`add-a-session`));
  modal.hide();
}

async function addASession() {
  try {
    const session = {
      name: name.value,
      start_date: new Date(),
      user_id: userStore.user.id,
      block_id: block_id.value,
      body_weight: body_weight.value,
      caffeine_intake: caffeine_intake.value,
      calories_prior_session: calories_prior_session.value,
      hours_of_sleep: hours_of_sleep.value,
      notes: notes.value,
    };

    // only grab values which are not empty
    const validSession = pickBy(session, (value, _key) => value !== '');

    loading.value = true;

    const res = await api.post(`/api/v1/sessions`, validSession);
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

    clearDataAndDismissModal();

    loading.value = false;

    router.push({
      path: `/dashboard/sessions/${json.data[0].id}`,
    });
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
  <div
    id="sessions-header"
    style="height: 64px"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3"
  >
    <!-- ---------- add group ---------- -->
    <span>
      <!-- add button -->
      <span
        @click="gerUserBlocksReady"
        class="link-secondary"
        role="button"
        data-bs-toggle="modal"
        data-bs-target="#add-a-session"
      >
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <font-awesome-icon icon="plus" class="p-0 m-0" />
          <span>Add a session</span>
        </h5>
      </span>

      <!-- add modal -->
      <form
        @submit.prevent="addASession()"
        class="modal fade px-2 py-5"
        id="add-a-session"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add a session</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <!-- modal body -->
            <div class="modal-body" v-auto-animate>
              <!-- alert -->
              <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-3 alert">
                <span>{{ alert.msg }}</span>
              </div>

              <!-- session name -->
              <div class="mb-3">
                <label for="session-header-session-name" class="form-label">Session name*</label>
                <input
                  v-model="name"
                  id="session-header-session-name"
                  class="form-control form-control-sm"
                  type="text"
                  required
                  :disabled="loading"
                />
              </div>

              <!-- start time -->
              <div class="mb-3">
                <label for="session-header-start-time" class="form-label">Start time*</label>
                <input
                  v-model="start_date"
                  id="session-header-start-time"
                  class="form-control form-control-sm"
                  type="datetime-local"
                  required
                  disabled
                />
              </div>

              <!-- show/hide button -->
              <div class="form-check form-switch mb-3">
                <input
                  v-model="showHideOtherFields"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="session-header-show-hide-button"
                  :disabled="loading"
                />
                <label class="form-check-label" for="session-header-show-hide-button">
                  <span v-if="!showHideOtherFields">Enable</span>
                  <span v-if="showHideOtherFields">Disable</span>
                  <span> other fields</span>
                </label>
              </div>

              <span v-if="showHideOtherFields">
                <div v-if="!blocks.items.length" class="mb-3">
                  <div class="alert alert-warning p-2">
                    <small
                      >There are not blocks available currently.
                      <router-link
                        @click="clearDataAndDismissModal()"
                        class="alert-link"
                        to="/dashboard/sessions/blocks?model=true"
                        >Click here!</router-link
                      >
                      to add start adding blocks!
                    </small>
                  </div>
                </div>

                <!-- block name -->
                <div class="mb-3">
                  <span class="d-flex gap-1">
                    <label for="session-header-block_id" class="form-label">Block name</label>
                    <router-link
                      @click="clearDataAndDismissModal()"
                      class="alert-link link-secondary"
                      to="/dashboard/sessions/blocks?model=true"
                    >
                      <span
                        class="fw-light fst-italic text-decoration-underline"
                        style="font-size: 0.8rem !important"
                        >Add more</span
                      >
                    </router-link>
                  </span>
                  <select
                    id="session-header-block_id"
                    class="form-control form-select form-select-sm"
                    v-model="block_id"
                    :disabled="loading || blocks.items.length === 0"
                  >
                    <option selected value="" disabled>Select a block!</option>
                    <option v-for="block in blocks.items" :value="block.id" :key="block.id">
                      {{ block.name }}
                    </option>
                  </select>
                </div>

                <div class="row mb-3">
                  <!-- bodyweight  -->
                  <div class="col-6">
                    <label for="session-header-bodyweight" class="form-label">Bodyweight</label>
                    <input
                      v-model="body_weight"
                      id="session-header-bodyweight"
                      class="form-control form-control-sm"
                      min="1"
                      max="300"
                      inputmode="numeric"
                      pattern="[1-300]*"
                      type="number"
                      :disabled="loading"
                    />
                  </div>

                  <!-- hours of sleep  -->
                  <div class="col-6">
                    <label for="session-header-sleep" class="form-label">Hours of sleep</label>
                    <input
                      v-model="hours_of_sleep"
                      id="session-header-sleep"
                      class="form-control form-control-sm"
                      min="1"
                      max="24"
                      type="number"
                      inputmode="numeric"
                      pattern="[1-24]*"
                      :disabled="loading"
                    />
                  </div>
                </div>

                <div class="row mb-3">
                  <!-- calories prior -->
                  <div class="col-6">
                    <label for="session-header-calories_prior_session" class="form-label"
                      >Calories
                    </label>
                    <input
                      v-model="calories_prior_session"
                      id="session-header-calories_prior_session"
                      class="form-control form-control-sm"
                      min="1"
                      max="5000"
                      type="number"
                      inputmode="numeric"
                      pattern="[1-5000]*"
                      :disabled="loading"
                    />
                  </div>

                  <!-- caffeine intake -->
                  <div class="col-6">
                    <label for="session-header-caffeine-intake" class="form-label">Caffeine</label>
                    <input
                      v-model="caffeine_intake"
                      id="session-header-caffeine-intake"
                      class="form-control form-control-sm"
                      min="1"
                      max="1000"
                      type="number"
                      inputmode="numeric"
                      pattern="[1-1000]*"
                      :disabled="loading"
                    />
                  </div>
                </div>

                <!-- notes -->
                <div class="mb-2">
                  <label for="notes" class="form-label">Notes</label>
                  <textarea
                    v-model="notes"
                    class="form-control form-control-sm"
                    id="notes"
                    rows="3"
                    :disabled="loading"
                  ></textarea>
                </div>
              </span>
            </div>
            <div class="modal-footer">
              <button
                @click="clearDataAndDismissModal()"
                v-if="!loading"
                ref="addASessionDismissButton"
                type="reset"
                class="btn btn-outline-dark"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-dark" :disabled="loading">
                <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>

                <span v-if="!loading">Submit</span>
                <span v-if="loading"> Loading...</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </span>

    <!-- middle -->
    <!-- <span @click="clearUsersSessionsCache()" class="link-secondary" role="button">
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <i class="bi bi-arrow-repeat"></i>
        <span>Clear cache</span>
      </h5>
    </span> -->

    <!-- right -->
    <div class="dropdown">
      <!-- setting icons -->
      <a
        class="link-dark"
        role="button"
        id="sessions-header-settings"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <!-- <i class="bi bi-three-dots-vertical"> </i> -->
          <font-awesome-icon icon="bars" />
        </h5>
      </a>

      <!-- setting links -->
      <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="min-width: fit-content">
        <li>
          <router-link class="nav-link dropdown-item" to="/dashboard/sessions/exercises"
            >Exercises
          </router-link>
        </li>
        <li>
          <router-link class="nav-link dropdown-item" to="/dashboard/sessions/categories"
            >Categories
          </router-link>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
        <li>
          <router-link class="nav-link dropdown-item" to="/dashboard/sessions/blocks"
            >Blocks</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.text-muted {
  color: #8c8c8c;
}

a {
  text-decoration: none;
  color: grey;
}

a:hover {
  color: #191919;
}

.active {
  text-decoration: none;
  color: #191919;
}

.nav-link {
  color: #212529;
  padding: 0.25rem 1rem;
}

.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  background: #212529;
  color: white;
}

.nav-link:hover {
  background: #6c757d;
  color: white;
}

.nav-link.active:hover {
  text-decoration: none;
}
</style>
