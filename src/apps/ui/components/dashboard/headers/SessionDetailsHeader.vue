<script setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { capitalizeAWord } from '../../../../../utils/helpers.js';
import api from '.././../../../../utils/fetch-with-style';

const router = useRouter();
const route = useRoute();
const previousPageName = ref('');
const updateCurrentSessionLoading = ref(null);

const alert = reactive({
  type: '',
  msg: '',
});

const props = defineProps({
  sessionName: String,
  sessionId: Number,
  userId: Number,
});

const emit = defineEmits('updateSessionName');

const newSessionName = ref('');

onMounted(() => {
  let back = router.options.history.state.back?.split('/');

  if (back === undefined) {
    back = route.path.split('/');
  }

  back = back[back?.length - 1];
  previousPageName.value = capitalizeAWord(back);
});

// this code below required for back drop problem fixed when adding a new session header model
onMounted(() => document.body.appendChild(document.getElementById(`update-current-session`)));
onUnmounted(() => document.body.removeChild(document.getElementById(`update-current-session`)));
// this code above required for back drop problem fixed when adding a new session header model

async function updateCurrentSession() {
  try {
    updateCurrentSessionLoading.value = true;

    const data = {
      name: newSessionName.value,
      user_id: props.userId,
    };

    const res = await api.patch(`/api/v1/sessions/${props.sessionId}`, data);
    const json = await res.json();

    emit('updateSessionName', newSessionName);

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    clearAndDismissUpdateCurrentSessionModal();
    updateCurrentSessionLoading.value = false;
  } catch (e) {
    updateCurrentSessionLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearAndDismissUpdateCurrentSessionModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById('update-current-session'),
  );
  modal.hide();
}
</script>

<template>
  <div
    id="session-details-header"
    style="height: 64px"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3"
  >
    <!-- back -->
    <span role="button" @click="$router.back()" class="link-secondary">
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="angle-left" class="p-0 m-0" />
        {{ previousPageName }}
      </h5>
    </span>

    <!-- middle -->
    <!-- <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." /> -->

    <!-- Edit -->
    <!-- <button class="btn btn-outline-dark">
      <i class="bi bi-pencil-square"></i>
      Edit
    </button> -->

    <div class="dropdown">
      <!-- setting icons -->
      <a
        class="link-dark"
        role="button"
        id="dropdownMenuButton1"
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
        <!-- edit -->
        <li>
          <button
            class="dropdown-item btn-sm"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#update-current-session"
          >
            Edit
          </button>
        </li>

        <!-- share -->
        <li><button class="dropdown-item btn-sm" type="button" disabled>Share</button></li>
      </ul>
    </div>

    <!-- modal -->
    <form
      @submit.prevent="updateCurrentSession()"
      class="modal fade px-2 py-5"
      id="update-current-session"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header">
            <h5 class="modal-title">
              <span> Update </span>
            </h5>
            <button
              @click="clearAndDismissUpdateCurrentSessionModal()"
              type="reset"
              class="btn-close"
              data-bs-dismiss="modal"
              :disabled="updateCurrentSessionLoading"
            ></button>
          </div>

          <!-- body -->
          <div class="modal-body">
            <!-- alert -->
            <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-3 alert">
              <span>{{ alert.msg }}</span>
            </div>

            <!-- session name -->
            <div class="mb-3">
              <label for="session-details-header-session-name" class="form-label"
                >Session name*</label
              >
              <input
                v-model="newSessionName"
                id="session-details-header-session-name"
                class="form-control form-control-sm"
                type="text"
                required
                :placeholder="sessionName"
                :disabled="updateCurrentSessionLoading"
              />
            </div>
          </div>

          <!-- footer -->
          <div class="modal-footer">
            <!-- cancel -->
            <button
              @click="clearAndDismissUpdateCurrentSessionModal()"
              v-if="!updateCurrentSessionLoading"
              type="reset"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              <i class="bi bi-x-circle"></i>
              Cancel
            </button>

            <!-- add -->
            <button type="submit" class="btn btn-primary" :disabled="updateCurrentSessionLoading">
              <div
                v-if="updateCurrentSessionLoading"
                class="spinner-border spinner-border-sm"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <span v-if="!updateCurrentSessionLoading">
                <i class="bi bi-check-circle-fill"></i>
                Submit
              </span>
              <span v-if="updateCurrentSessionLoading"> Loading... </span>
            </button>
          </div>
        </div>
      </div>
    </form>
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
