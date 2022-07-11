<script setup>
import api from '../../../../../libs/fetch-with-style.js';
import { pickBy } from 'lodash-es';
import dayjs from 'dayjs';

import { ref, onMounted } from 'vue';

import useUserStore from '../../../store/user.store.js';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const addASessionDismissButton = ref(null);
const sessionName = ref('');
const blockId = ref('');
const date = ref(null);
const bodyweight = ref('');
const hoursOfSleep = ref('');
const notes = ref('');
const user_id = userStore.user.id;

async function addASession() {
  try {
    const session = {
      user_id: user_id,
      session_name: sessionName.value,
      block_id: blockId.value,
      start_date: dayjs(date.value).format('YYYY-MM-DD'),
      body_weight: bodyweight.value,
      hours_of_sleep: hoursOfSleep.value,
      notes: notes.value,
    };

    const validSession = pickBy(session, (value, key) => value !== '');

    const res = await api.post(`/api/v1/sessions`, validSession);
    const json = await res.json();

    addASessionDismissButton.value.click();
    router.push({
      path: `/dashboard/sessions/${json.data[0].id}`,
    });
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  // back drop problem fixed
  document.body.appendChild(document.getElementById('add-a-session'));

  // init date
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  date.value = now.toISOString().slice(0, 16);
});
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
        class="link-secondary"
        role="button"
        data-bs-toggle="modal"
        data-bs-target="#add-a-session"
      >
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <font-awesome-icon icon="plus" class="p-0 m-0" />
          <span>Add</span>
        </h5>
      </span>

      <!-- add modal -->
      <form
        @submit.prevent="addASession()"
        class="modal fade px-2 pt-5"
        id="add-a-session"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog">
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
            <div class="modal-body">
              <!-- session name -->
              <div class="mb-3">
                <label for="session-name" class="form-label">Session name*</label>
                <input
                  v-model="sessionName"
                  id="session-name"
                  class="form-control form-control-sm"
                  type="text"
                  required
                />
              </div>

              <!-- start time -->
              <div class="mb-3">
                <label for="start-time" class="form-label">Start time*</label>
                <input
                  id="start-time"
                  class="form-control form-control-sm"
                  type="datetime-local"
                  :value="date"
                  required
                  disabled
                />
              </div>

              <!-- show/hide button -->
              <div class="mx-auto" style="max-width: 40%">
                <button
                  class="accordion-button collapsed p-0 m-0"
                  style="background: none; border: none; box-shadow: none"
                  role="button"
                  data-bs-toggle="collapse"
                  data-bs-target=".add-session-other-settings"
                >
                  Other fields
                </button>
              </div>

              <span class="add-session-other-settings accordion-collapse collapse">
                <!-- block name -->
                <div class="mb-3">
                  <label for="block-id" class="form-label">Block ID</label>
                  <input id="block-id" class="form-control form-control-sm" type="text" />
                </div>

                <!-- bodyweight  -->
                <div class="mb-3">
                  <label for="bodyweight" class="form-label">Bodyweight</label>
                  <input
                    id="bodyweight"
                    class="form-control form-control-sm"
                    min="1"
                    type="number"
                  />
                </div>

                <!-- hours of sleep  -->
                <div class="mb-3">
                  <label for="sleep" class="form-label">Hours of sleep</label>
                  <input id="sleep" class="form-control form-control-sm" min="1" type="number" />
                </div>

                <!-- notes -->
                <div class="mb-2">
                  <label for="notes" class="form-label">Notes</label>
                  <textarea class="form-control form-control-sm" id="notes" rows="3"></textarea>
                </div>
              </span>
            </div>
            <div class="modal-footer">
              <button
                ref="addASessionDismissButton"
                type="button"
                class="btn btn-secondary"
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

    <!-- middle -->
    <!-- <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." /> -->

    <!-- settings -->
    <router-link :class="{ active: $route.name === 'Settings' }" to="/dashboard/settings">
      <font-awesome-icon class="fs-4" icon="gear" />
    </router-link>
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
</style>
