<script setup>
import api from '../../../../../libs/fetch-with-style.js';
import { sleep } from '../../../../../utils/helpers.js'

import { nextTick, ref, onMounted, reactive, onUpdated } from 'vue';
import { pickBy } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';

import dayjs from 'dayjs';

import useUserStore from '../../../store/user.store.js';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const addASessionDismissButton = ref(null);
const showHideOtherFields = ref(false);

const session_name = ref('');
const start_date = ref(dayjs().format("YYYY-MM-DDTHH:mm"));
const user_id = ref(userStore.user.id);
const block_id = ref('');
const body_weight = ref('');
const hours_of_sleep = ref('');
const notes = ref('');
const random_uuid = ref(uuidv4());
const loading = ref(false);

const alert = reactive({
  type: '',
  msg: '',
});


onMounted(() => {
  // back drop problem fixed
  document.body.appendChild(document.getElementById(`add-a-session-${random_uuid.value}`));
});

function clearDataAndDismissModal() {
  alert.type = '';
  alert.msg = '';
  session_name.value = "";
  start_date.value = dayjs().format("YYYY-MM-DDTHH:mm");
  user_id.value = userStore.user.id;
  block_id.value = "";
  body_weight.value = "";
  hours_of_sleep.value = "";
  notes.value = "";
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`add-a-session-${random_uuid.value}`));
  modal.hide();
}

async function addASession() {
  try {

    const session = {
      session_name: session_name.value,
      start_date: dayjs().format("YYYY-MM-DDTHH:mm"),
      user_id: user_id.value = userStore.user.id,
      block_id: block_id.value,
      body_weight: body_weight.value,
      hours_of_sleep: hours_of_sleep.value,
      notes: notes.value,
    }

    // only grab values which are not empty
    const validSession = pickBy(session, (value, key) => value !== '');

    loading.value = true;

    const res = await api.post(`/api/v1/sessions`, validSession);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    clearDataAndDismissModal()

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
  <div id="sessions-header" style="height: 64px"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3">
    <!-- ---------- add group ---------- -->
    <span>
      <!-- add button -->
      <span @click="clearDataAndDismissModal()" class="link-secondary" role="button" data-bs-toggle="modal"
        :data-bs-target="`#add-a-session-${random_uuid}`">
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <font-awesome-icon icon="plus" class="p-0 m-0" />
          <span>Add</span>
        </h5>
      </span>

      <!-- add modal -->
      <form @submit.prevent="addASession()" class="modal fade px-2 pt-5" :id="`add-a-session-${random_uuid}`"
        data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add a session</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- modal body -->
            <div class="modal-body">
              <!-- alert -->
              <div v-if="alert.type" :class="`alert-${alert.type}`"
                class="mb-3 alert animate__animated animate__zoomIn animate__faster">
                <span>{{ alert.msg }}</span>
              </div>

              <!-- session name -->
              <div class="mb-3">
                <label for="session-name" class="form-label">Session name*</label>
                <input v-model="session_name" id="session-name" class="form-control form-control-sm" type="text"
                  required :disabled="loading" />
              </div>

              <!-- start time -->
              <div class="mb-3">
                <label for="start-time" class="form-label">Start time*</label>
                <input v-model="start_date" id="start-time" class="form-control form-control-sm" type="datetime-local"
                  required disabled />
              </div>

              <!-- show/hide button -->
              <div class="form-check form-switch mb-3">
                <input v-model="showHideOtherFields" class="form-check-input" type="checkbox" role="switch"
                  id="show-hide-button" :disabled="loading">
                <label class="form-check-label" for="show-hide-button">
                  <span v-if="!showHideOtherFields">Show</span>
                  <span v-if="showHideOtherFields">Hide</span>
                  <span> other fields</span>
                </label>
              </div>

              <span v-if="showHideOtherFields">
                <!-- block name -->
                <div class="mb-3">
                  <label for="block-id" class="form-label">Block ID</label>
                  <input v-model="block_id" id="block-id" class="form-control form-control-sm" type="text"
                    :disabled="loading" />
                </div>

                <!-- bodyweight  -->
                <div class="mb-3">
                  <label for="bodyweight" class="form-label">Bodyweight</label>
                  <input v-model="body_weight" id="bodyweight" class="form-control form-control-sm" min="1"
                    type="number" :disabled="loading" />
                </div>

                <!-- hours of sleep  -->
                <div class="mb-3">
                  <label for="sleep" class="form-label">Hours of sleep</label>
                  <input v-model="hours_of_sleep" id="sleep" class="form-control form-control-sm" min="1" type="number"
                    :disabled="loading" />
                </div>

                <!-- notes -->
                <div class="mb-2">
                  <label for="notes" class="form-label">Notes</label>
                  <textarea v-model="notes" class="form-control form-control-sm" id="notes" rows="3"
                    :disabled="loading"></textarea>
                </div>
              </span>
            </div>
            <div class="modal-footer">
              <button v-if="!loading" ref="addASessionDismissButton" type="reset" class="btn btn-secondary"
                data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" class="btn btn-dark " :disabled="loading">
                <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>

                <span v-if="!loading"> Submit </span>
                <span v-if="loading"> Loading... </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </span>

    <!-- middle -->
    <!-- <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." /> -->

    <!-- settings -->
    <div class="dropdown">
      <!-- setting icons -->
      <a class="link-dark" role="button" :id="`sessions-header-settings-${random_uuid}`" data-bs-toggle="dropdown"
        aria-expanded="false">
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <i class="bi bi-three-dots-vertical"> </i>
        </h5>
      </a>

      <!-- setting links -->
      <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="min-width: fit-content">
        <li>
          <router-link class="nav-link dropdown-item" to="/dashboard/sessions/exercises">Exercises
          </router-link>
        </li>
        <li>
          <router-link class="nav-link dropdown-item" to="/dashboard/sessions/categories">Categories
          </router-link>
        </li>
        <li>
          <hr class="dropdown-divider">
        </li>
        <li>
          <router-link class="nav-link dropdown-item" to="/dashboard/sessions/blocks">Blocks</router-link>
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
}

.nav-pills .nav-link.active,
.nav-pills .show>.nav-link {
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
