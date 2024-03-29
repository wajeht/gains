<script setup>
import { capitalizeAWord } from '../../../../../utils/helpers.js';
import api from '../../../../../utils/fetch-with-style.js';
import ExercisesCategoriesBlocksNav from '../../../components/shared/ExercisesCategoriesBlocksNav.vue';
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import useUserStore from '../../../store/user.store.js';
import useAppStore from '../../../store/app.store.js';

const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const exercises = ref([]);
const categories = ref([]);

const name = ref('');
const exercise_category_id = ref('');
const user_id = ref(userStore.user.id);

const previousPageName = ref('');
const loading = ref(false);
const alert = reactive({
  type: '',
  msg: '',
});

onMounted(() => {
  const model = route.query.model;
  if (model === 'true') {
    const x = document.getElementById(`add-a-exercise`);
    x.click();
  }
});

onMounted(async () => {
  appStore.loading = true;
  const data = await getUserExercise();
  exercises.value = data || [];

  const c = await getUserExerciseCategories();
  categories.value = c || [];
  appStore.loading = false;
});

onMounted(() => {
  document.body.appendChild(document.getElementById(`add-a-exercise`));
});

onMounted(() => {
  let back = router.options.history.state.back?.split('/');
  back = back[back?.length - 1];
  previousPageName.value = capitalizeAWord(back);
});

async function getUserExercise() {
  try {
    const res = await api.get(`/api/v1/exercises?user_id=${userStore.user.id}`);
    const json = await res.json();

    if (json.data.length == 0) {
      alert.type = 'warning';
      alert.msg = json.message + ' Please add a exercise via click the plus icon!';
      return;
    }
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
    appStore.loading = false;
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

async function getUserExerciseCategories() {
  try {
    const res = await api.get(`/api/v1/exercise-categories?user_id=${userStore.user.id}&all=true`);
    const json = await res.json();

    if (json.data.length == 0) {
      alert.type = 'warning';
      alert.msg = json.message;
      return;
    }
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
    appStore.loading = false;
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
    const exercise = {
      name: name.value,
      exercise_category_id: exercise_category_id.value,
      user_id: user_id.value,
    };

    loading.value = true;

    const res = await api.post(`/api/v1/exercises`, exercise);
    const json = await res.json();
    if (res.status >= 500) {
      throw new Error(
        'The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again later!',
      );
    }
    if (!res.ok) {
      loading.value = false;
      clearDataAndDismissModal();
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    const data = exercise.name
      .split(',')
      .filter((c) => c.length != 0)
      .map((c) => {
        return {
          name: c.trim(),
          exercise_category_id: exercise.exercise_category_id,
          user_id: exercise.user_id,
        };
      });

    data.forEach((c) => {
      exercises.value.unshift(c);
    });

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
  exercise_category_id.value = '';
  user_id.value = userStore.user.id;

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(`add-a-exercise`));
  modal.hide();
}
</script>

<template>
  <!-- header -->
  <div
    id="exercises-page-header"
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
        data-bs-target="#add-a-exercise"
      >
        <!-- add btn -->
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <font-awesome-icon icon="plus" class="p-0 m-0" />
          Add a exercise
        </h5>

        <!-- modal -->
        <form
          @submit.prevent="addAExercise()"
          class="modal fade px-2 py-5"
          id="add-a-exercise"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add a exercise</h5>
                <button
                  @click="clearDataAndDismissModal()"
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <!-- exercise category name -->
                <div v-if="!categories.length" class="mb-3">
                  <div class="alert alert-warning p-2">
                    <small
                      >Exercise categories must be defined before being able to add new exercises.
                      <router-link
                        @click="clearDataAndDismissModal()"
                        class="alert-link"
                        to="/dashboard/sessions/categories?model=true"
                        >Click here!</router-link
                      >
                      to add exercise categories!
                    </small>
                  </div>
                </div>

                <!-- exercise category name -->
                <div class="mb-3">
                  <span class="d-flex gap-1">
                    <label for="exercise-category-name" class="form-label"
                      >Exercise category name*</label
                    >
                    <router-link
                      @click="clearDataAndDismissModal()"
                      class="alert-link link-secondary"
                      to="/dashboard/sessions/categories?model=true"
                    >
                      <span class="fw-light fst-italic" style="font-size: 0.8rem !important"
                        >Add more</span
                      >
                    </router-link>
                  </span>
                  <select
                    id="exercise-category-name"
                    class="form-control form-select form-select-sm"
                    v-model="exercise_category_id"
                    :disabled="loading || categories.length === 0"
                    required
                  >
                    <option selected value="" disabled>Select a exercise category!</option>
                    <option
                      v-for="category in categories"
                      :value="category.id"
                      :key="`category-id-${category.id}`"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <!-- exercise name -->
                <div class="mb-3">
                  <label for="exercise-name" class="form-label">Exercise name*</label>
                  <input
                    v-model="name"
                    id="exercise-name"
                    class="form-control form-control-sm"
                    type="text"
                    required
                    :disabled="loading || exercise_category_id.length === 0"
                  />
                </div>
              </div>

              <!-- footer -->
              <div class="modal-footer">
                <button
                  @click="clearDataAndDismissModal()"
                  v-if="!loading"
                  type="reset"
                  class="btn btn-outline-dark"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" class="btn btn-dark" :disabled="loading || name.length === 0">
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
          id="category-header-dropdown"
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
    <div class="flex flex-column justify-content-between my-3">
      <div class="d-flex flex-column gap-3">
        <!-- alert -->
        <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert" v-auto-animate>
          <span>{{ alert.msg }}</span>
        </div>

        <!-- blocks -->
        <div>
          <!-- title -->
          <ExercisesCategoriesBlocksNav />

          <!-- individual blocks -->
          <div class="list-group" v-auto-animate>
            <router-link
              v-for="(exercise, i) in exercises"
              :key="`key-${exercise.id}`"
              :to="`/dashboard/exercises/${exercise.id}`"
              class="list-group-item list-group-item-action d-flex justify-content-between py-3"
            >
              <!-- left -->
              <h6 class="mb-0">{{ i + 1 }}. {{ exercise.name }}</h6>

              <!-- right -->
              <small class="opacity-50 inline-block">{{ exercise.category_name }}</small>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-item {
  padding: 0.25rem 1rem;
}

.dropdown-item:hover {
  background: #6c757d;
  color: white !important;
}
.dropdown-item.active,
.dropdown-item:active {
  background: #212529;
  color: white !important;
}
</style>
