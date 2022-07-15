<script setup>
import {
  capitalizeAWord,
  formatToGainsDateLocal,
  sleep,
  gainsDateDisplay,
} from '../../../../../utils/helpers.js';
import api from '../../../../../libs/fetch-with-style.js';

import dayjs from 'dayjs';

import { v4 as uuidv4 } from 'uuid';
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import useUserStore from '../../../store/user.store.js';
import useAppStore from '../../../store/app.store.js';

const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const random_uuid = ref(uuidv4());

const blocks = reactive({
  items: [],
});

const name = ref('');
const description = ref('');
const start_date = ref('');
const end_date = ref('');
const user_id = ref(userStore.user.id);

const previousPageName = ref('');
const loading = ref(false);
const alert = reactive({
  type: '',
  msg: '',
});

onMounted(async () => {
  appStore.loading = true;
  const data = await getUserBlocks();
  blocks.items = data || [];
  appStore.loading = false;
});

onMounted(() => {
  document.body.appendChild(document.getElementById(`add-a-block-${random_uuid.value}`));
});

onMounted(() => {
  let back = router.options.history.state.back.split('/');
  back = back[back.length - 1];
  previousPageName.value = capitalizeAWord(back);
});

async function getUserBlocks() {
  try {
    const res = await api.get(`/api/v1/blocks?user_id=${userStore.user.id}`);
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

async function addABlock() {
  try {
    const block = {
      name: name.value,
      description: description.value,
      start_date: start_date.value,
      end_date: end_date.value,
      user_id: user_id.value,
    };

    loading.value = true;

    const res = await api.post(`/api/v1/blocks`, block);
    const json = await res.json();

    if (!res.ok) {
      loading.value = false;
      clearDataAndDismissModal();
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    blocks.items.unshift(block);

    clearDataAndDismissModal();

    loading.value = false;
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

function clearDataAndDismissModal() {
  alert.type = '';
  alert.msg = '';

  name.value = '';
  description.value = '';
  start_date.value = '';
  end_date.value = '';
  user_id.value = userStore.user.id;

  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById(`add-a-block-${random_uuid.value}`),
  );
  modal.hide();
}
</script>

<template>
  <!-- header -->
  <div
    style="height: 64px"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3"
  >
    <!-- back button -->
    <span role="button" @click="$router.back()" class="link-secondary">
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="angle-left" class="p-0 m-0" />
        {{ previousPageName }}
      </h5>
    </span>

    <!-- settings group -->
    <span class="d-flex justify-content-center align-items-center gap-2">
      <!-- add group -->
      <span
        class="link-secondary"
        role="button"
        data-bs-toggle="modal"
        :data-bs-target="`#add-a-block-${random_uuid}`"
      >
        <!-- add btn -->
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <font-awesome-icon icon="plus" class="p-0 m-0" />
        </h5>

        <!-- modal -->
        <form
          @submit.prevent="addABlock()"
          class="modal fade px-2 pt-5"
          :id="`add-a-block-${random_uuid}`"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add a block</h5>
                <button
                  @click="clearDataAndDismissModal()"
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <!-- block name -->
                <div class="mb-3">
                  <label for="block-name" class="form-label">Block name*</label>
                  <input
                    v-model="name"
                    id="block-name"
                    class="form-control form-control-sm"
                    type="text"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- block description -->
                <div class="mb-2">
                  <label for="block-description" class="form-label">Block description</label>
                  <textarea
                    v-model="description"
                    class="form-control form-control-sm"
                    id="block-description"
                    rows="3"
                    :disabled="loading || name.length === 0"
                  ></textarea>
                </div>

                <!-- block start date -->
                <div class="mb-3">
                  <label for="block-start-date" class="form-label">Start date*</label>
                  <input
                    v-model="start_date"
                    id="block-start-date"
                    class="form-control form-control-sm"
                    type="datetime-local"
                    required
                    :disabled="loading || description.length === 0"
                  />
                </div>

                <!-- block end date -->
                <div class="mb-3">
                  <label for="block-start-date" class="form-label">End date*</label>
                  <input
                    v-model="end_date"
                    id="block-end-date"
                    class="form-control form-control-sm"
                    type="datetime-local"
                    required
                    :disabled="loading || start_date.length === 0"
                  />
                </div>
              </div>

              <!-- footer -->
              <div class="modal-footer">
                <button
                  @click="clearDataAndDismissModal()"
                  v-if="!loading"
                  type="reset"
                  class="btn btn-outline-danger"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-dark"
                  :disabled="loading || end_date.length === 0"
                >
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

      <!--  -->
      <div class="dropdown">
        <!-- setting icons -->
        <a
          class="link-dark"
          role="button"
          :id="`block-header-dropdown-${random_uuid}`"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
            <i class="bi bi-three-dots-vertical"> </i>
          </h5>
        </a>

        <!-- setting links -->
        <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="min-width: fit-content">
          <li>
            <router-link
              class="nav-link link-dark dropdown-item"
              to="/dashboard/sessions/exercises"
              :class="{ active: $route.name === 'Exercises' }"
              >Exercises
            </router-link>
          </li>
          <li>
            <router-link
              class="nav-link link-dark dropdown-item"
              to="/dashboard/sessions/categories"
              :class="{ active: $route.name === 'Categories' }"
              >Categories
            </router-link>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <router-link
              class="nav-link link-dark dropdown-item"
              to="/dashboard/sessions/blocks"
              :class="{ active: $route.name === 'Blocks' }"
              >Blocks</router-link
            >
          </li>
        </ul>
      </div>
    </span>
  </div>

  <!-- content -->
  <div class="container px-3">
    <div class="flex flex-column justify-content-between my-3" data-aos="fade-up">
      <div class="d-flex flex-column gap-3">
        <!-- alert -->
        <div
          v-if="alert.type"
          :class="`alert-${alert.type}`"
          class="mb-0 alert animate__animated animate__zoomIn animate__faster"
        >
          <span>{{ alert.msg }}</span>
        </div>

        <!-- blocks -->
        <div>
          <!-- title -->
          <ul class="nav nav-tabs border-0">
            <li class="nav-item">
              <router-link
                class="nav-link"
                :class="{ active: $route.name === 'Exercises' }"
                to="/dashboard/sessions/exercises"
              >
                <h5 class="mb-0"><i class="bi bi-person-fill"></i> Exercises</h5></router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                :class="{ active: $route.name === 'Categories' }"
                to="/dashboard/sessions/categories"
              >
                <h5 class="mb-0"><i class="bi bi-person-fill"></i> Categories</h5></router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                :class="{ active: $route.name === 'Blocks' }"
                to="/dashboard/sessions/blocks"
              >
                <h5 class="mb-0"><i class="bi bi-person-fill"></i> Blocks</h5></router-link
              >
            </li>
          </ul>

          <!-- individual blocks -->
          <div class="list-group">
            <router-link
              v-for="block in blocks.items"
              to=""
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">{{ block.name }}</h6>
                  <p class="mb-0 opacity-75">{{ block.description }}</p>
                </div>
              </div>
              <small class="opacity-50 d-flex flex-column gap-2">
                <span>{{ dayjs(block.start_date).format('YY/MM/DD') }}</span>
                <span>{{ dayjs(block.end_date).format('YY/MM/DD') }}</span>
              </small>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-item.active,
.dropdown-item:active {
  background: #212529;
  color: white;
}

.nav-link {
  color: #212529;
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
