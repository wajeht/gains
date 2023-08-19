<script setup>
import { ref, onMounted, reactive, watch, onUnmounted } from 'vue';
import useAppStore from '../../store/app.store.js';
import api from '../../../../utils/fetch-with-style.js';
import dayjs from 'dayjs';
import Paginator from '../../components/shared/Paginator.vue';
// import InsideLoading from '../../components/shared/InsideLoading.vue';
import { pickBy, isEqual } from 'lodash-es';

const appStore = useAppStore();
const users = ref([]);
const checkedUsers = ref([]);
const loading = ref(false);
const checkAll = ref(false);
const searchInput = ref('');

const checkAllRef = ref();

const deleteAUserLoading = ref(false);
const addAUserLoading = ref(false);
const modifyAUserLoading = ref(false);
const selectedModifyAUserOG = reactive({});
const selectedModifyAUser = reactive({});
const selectedModifyAUserIndex = ref(-1);
const sendPasswordResetLinkLoading = ref(false);

const alert = reactive({ type: '', msg: '' });

const DEFAULT_PER_PAGE = 10;

const pagination = reactive({
  perPage: DEFAULT_PER_PAGE,
});

onMounted(async () => {
  await fetchUsers({});
});

watch(checkAll, (value) => {
  if (!value) {
    checkedUsers.value = [];
  }

  if (value) {
    checkedUsers.value = users.value.map((u) => u.id);
  }
});

async function addUser() {
  clearAndDismissAddAUserModal();
}

async function sendPasswordResetLink(email) {
  try {
    sendPasswordResetLinkLoading.value = true;

    const res = await api.post(` /api/auth/forget-password`, { email });
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    sendPasswordResetLinkLoading.value = false;
  } catch (e) {
    sendPasswordResetLinkLoading.value = false;
    appStore.loading = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function deleteUser() {
  try {
    deleteAUserLoading.value = true;

    const ress = await Promise.all(
      checkedUsers.value.map((id) => api.delete(`/api/v1/users/${id}`)),
    );
    const jsons = await Promise.all(ress.map((data) => data.json()));

    ress.forEach((res) => {
      if (!res.ok) {
        jsons.forEach((json) => {
          if (json.errors) {
            throw json.errors;
          } else {
            throw json.message;
          }
        });
      }
    });

    // update the dom
    for (const u in users.value) {
      for (const ck in checkedUsers.value) {
        // console.log(checkedUsers.value[ck], users.value[u].id);
        if (users.value[u].id == checkedUsers.value[ck]) {
          users.value[u].deleted = true;
        }
      }
    }

    checkedUsers.value = [];
    checkAll.value = false;

    checkAllRef.value.checked = false;

    deleteAUserLoading.value = false;
    clearAndDismissDeleteAUserModal();
  } catch (e) {
    deleteAUserLoading.value = false;
    checkAll.value = false;
    checkAllRef.value.checked = false;
    checkedUsers.value = [];
    clearAndDismissDeleteAUserModal();
    appStore.loading = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function modifyUser() {
  const diff = pickBy(selectedModifyAUser, (v, k) => !isEqual(selectedModifyAUserOG[k], v));

  // ------------ refactor this below ---------------------
  // remember trying to convert the correct date format to insert into db
  // db uses iso string
  const dateFormat = (date) => dayjs(date).format('YYYY-MM-DD');
  if (dateFormat(selectedModifyAUser.birth_date) === dateFormat(selectedModifyAUserOG.birth_date)) delete diff.birth_date; // prettier-ignore
  if (dateFormat(selectedModifyAUser.created_at) === dateFormat(selectedModifyAUserOG.created_at)) delete diff.created_at; // prettier-ignore
  if (diff.created_at) diff.created_at = dayjs(diff.created_at).toISOString();
  if (diff.birth_date) diff.birth_date = dayjs(diff.birth_date).toISOString();
  // ------------ refactor this above ---------------------

  if (Object.keys(diff).length === 0) {
    clearAndDismissModifyAUserModal();
    return;
  }

  try {
    modifyAUserLoading.value = true;

    const res = await api.patch(`/api/v1/users/${selectedModifyAUserOG.id}`, diff);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    modifyAUserLoading.value = false;
    clearAndDismissModifyAUserModal();

    users.value[selectedModifyAUserIndex.value] = json.data[0];
  } catch (e) {
    clearAndDismissModifyAUserModal();
    modifyAUserLoading.value = false;
    appStore.loading = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

async function resetTable() {
  searchInput.value = '';
  await fetchUsers({});
}

async function fetchUsers({ perPage = DEFAULT_PER_PAGE, currentPage = 1 }) {
  try {
    loading.value = true;

    const res = await api.get(
      `/api/v1/users?cache=false&perPage=${perPage}&currentPage=${currentPage}&search=${searchInput.value}`,
    );
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    users.value = json.data;
    Object.assign(pagination, json.pagination);

    loading.value = false;
  } catch (e) {
    appStore.loading = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

// this code below required for back drop problem fixed when adding a new session header model
// modify
onMounted(() => document.body.appendChild(document.getElementById(`modify-a-user`)));
onUnmounted(() => document.body.removeChild(document.getElementById(`modify-a-user`)));

// delete
onMounted(() => document.body.appendChild(document.getElementById(`delete-a-user`)));
onUnmounted(() => document.body.removeChild(document.getElementById(`delete-a-user`)));

// add
onMounted(() => document.body.appendChild(document.getElementById(`add-a-user`)));
onUnmounted(() => document.body.removeChild(document.getElementById(`add-a-user`)));
// this code above required for back drop problem fixed when adding a new session header model

function clearAndDismissDeleteAUserModal() {
  deleteAUserLoading.value = false;
  checkAll.value = false;
  checkAllRef.value.checked = false;
  checkedUsers.value = [];
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('delete-a-user'));
  modal.hide();
}

function clearAndDismissAddAUserModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('add-a-user'));
  modal.hide();
}

function clearAndDismissModifyAUserModal() {
  Object.assign(selectedModifyAUser, {});
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modify-a-user'));
  modal.hide();
}
</script>

<template>
  <!-- alert -->
  <div v-if="alert.type" :class="`alert-${alert.type}`" class="alert mb-0">
    <span>{{ alert.msg }}</span>
  </div>

  <div style="position: relative">
    <!-- loading -->
    <!-- <InsideLoading v-if="loading" /> -->

    <!-- card -->
    <div class="card">
      <!-- header -->
      <div class="card-header d-flex justify-content-between align-items-center">
        <!-- left -->
        <div class="d-flex gap-2 align-items-center">
          <h5 class="card-title mb-0 mt-0">Users</h5>
          <h6 class="card-subtitle mb-0 mt-0 text-muted">- all users inside gains</h6>
        </div>

        <!-- right -->
        <div class="d-flex gap-2 align-items-center">
          <!-- search -->
          <div @keydown.enter="fetchUsers({})" class="input-group input-group-sm">
            <input v-model="searchInput" type="search" class="form-control" for="search" />
            <button
              @click="fetchUsers({})"
              class="btn btn-dark"
              type="button"
              id="search"
              :disabled="!searchInput.length"
            >
              <i class="bi bi-search"></i>
            </button>
          </div>

          <!-- reset -->
          <button @click="resetTable()" class="btn btn-sm btn-dark" type="button">
            <i class="bi bi-arrow-repeat"></i>
          </button>

          <!-- add -->
          <button
            data-bs-toggle="modal"
            data-bs-target="#add-a-user"
            class="btn btn-sm btn-dark"
            type="button"
          >
            <i class="bi bi-plus-circle"></i>
          </button>

          <!-- trash -->
          <button
            class="btn btn-sm btn-dark"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#delete-a-user"
            :disabled="!checkedUsers.length"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <!-- body -->
      <div class="card-body" style="overflow: scroll !important">
        <!-- table -->
        <table class="table table-hover text-nowrap">
          <!-- table header -->
          <thead>
            <tr>
              <th scope="col">
                <input
                  @click="checkAll = !checkAll"
                  class="form-check-input"
                  ref="checkAllRef"
                  type="checkbox"
                  id="checkbox-for-title"
                />
              </th>
              <th scope="col">ID</th>
              <th scope="col">User</th>
              <th scope="col">Date Created</th>
              <th scope="col">Account Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <!-- table body -->
          <!-- **************************** LOADING STATE STARTS **************************** -->
          <tbody
            v-if="loading"
            class="placeholder-glow animate__animated animate__fadeIn animate__faster"
          >
            <tr v-for="(i, index) in pagination.perPage" :key="`loading-key-${index}`">
              <!-- checkbox -->
              <th scope="row">
                <span class="placeholder col-6"></span>
              </th>

              <!-- id -->
              <th scope="row"><span class="placeholder col-6"></span></th>

              <!-- user -->
              <td>
                <div class="d-flex gap-1" style="min-height: 90px !important">
                  <!-- pic -->
                  <span class="placeholder col-6 rounded"></span>

                  <!-- role -->
                  <div class="d-flex flex-column gap-1 justify-content-between">
                    <!-- top -->
                    <span class="placeholder col-6"></span>

                    <!-- bottom -->
                    <div
                      class="d-flex flex-column fw-light gap-1"
                      style="min-width: 200px !important"
                    >
                      <!-- username -->
                      <span class="placeholder col-6"></span>

                      <!-- weight -->
                      <span class="placeholder col-6"></span>

                      <!-- birthday -->
                      <span class="placeholder col-6"></span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- date created -->
              <td><span class="placeholder col-6"></span></td>

              <!-- status -->
              <td>
                <div class="d-flex flex-column gap-1">
                  <span class="placeholder bg-success col-6 rounded"></span>
                  <span class="placeholder bg-success col-6 rounded"></span>
                </div>
              </td>

              <!-- actions -->
              <td>
                <div class="d-flex gap-2">
                  <span class="placeholder col-6"></span>
                  <span class="placeholder col-6"></span>
                </div>
              </td>
            </tr>
          </tbody>
          <!-- **************************** LOADING STATE ENDS **************************** -->

          <!-- table body -->
          <tbody v-if="!loading" class="animate__animated animate__fadeIn animate__faster">
            <tr v-for="(u, index) in users" :key="`user-key-${u.id}`">
              <!-- checkbox -->
              <th scope="row">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="u.id"
                  v-model="checkedUsers"
                  :id="`checkbox-id-${u.id}`"
                />
              </th>

              <!-- id -->
              <th scope="row">{{ u.id }}</th>

              <!-- user -->
              <td>
                <div class="d-flex gap-1" :class="{ 'grayscale text-muted': u.deleted }">
                  <!-- pic -->
                  <img
                    v-if="u.profile_picture_url"
                    :src="u.profile_picture_url"
                    style="max-width: 20%; max-height: auto; box-sizing: border-box"
                    class="rounded"
                    :style="{
                      'border-left': u.role === 'admin' ? '5px solid #FAA819 !important' : '',
                    }"
                  />

                  <!-- role -->
                  <div class="d-flex flex-column gap-1">
                    <!-- top -->
                    <span class="d-flex gap-1 justify-content-center align-items-center">
                      <span v-if="u.first_name || u.last_name" class="fw-bold">{{
                        u.first_name + ' ' + u.last_name
                      }}</span>
                      <small v-if="u.first_name || u.last_name" class="fst-italic fw-light">
                        - {{ u.role }}
                        <font-awesome-icon
                          v-if="u.role === 'admin'"
                          icon="fa-crown"
                          style="color: #faa819"
                      /></small>
                    </span>

                    <!-- bottom -->
                    <small class="d-flex flex-column fw-light">
                      <!-- username -->
                      <span><i class="bi bi-person-fill me-1"></i>@{{ u.username }}</span>

                      <!-- weight -->
                      <span v-if="u.weight">
                        <font-awesome-icon icon="fa-weight-scale " class="me-1" />{{ u.weight }}
                        {{ appStore.unit.label }}
                      </span>

                      <!-- birthday -->
                      <span v-if="u.birth_date">
                        <i class="bi bi-balloon-fill me-1"></i
                        >{{ dayjs(u.birth_date).format('YYYY/MM/DD') }}</span
                      >
                    </small>
                  </div>
                </div>
              </td>

              <!-- date created -->
              <td>
                <span :class="{ 'grayscale text-muted': u.deleted }">
                  {{ dayjs(u.created_at).format('YYYY/MM/DD') }}
                </span>
              </td>

              <!-- status -->
              <td>
                <div style="display: inline-block !important">
                  <div class="d-flex flex-column gap-1">
                    <!-- verified -->
                    <small
                      :class="{
                        'bg-success text-white px-1 rounded': u.verified,
                        'bg-warning text-white px-1 rounded': !u.verified,
                      }"
                    >
                      <span v-if="!u.verified">not verified</span>
                      <span v-if="u.verified">verified</span>
                    </small>

                    <!-- deleted -->
                    <small
                      :class="{
                        'bg-success text-white px-1 rounded': !u.deleted,
                        'bg-danger text-white px-1 rounded': u.deleted,
                      }"
                    >
                      <span v-if="!u.deleted">active</span>
                      <span v-if="u.deleted">inactive</span>
                    </small>
                  </div>
                </div>
              </td>

              <!-- actions -->
              <td>
                <div class="d-flex gap-2">
                  <span
                    @click="
                      () => {
                        selectedModifyAUserIndex = index;
                        Object.assign(selectedModifyAUserOG, ...users.filter((x) => x.id === u.id));
                        Object.assign(selectedModifyAUser, ...users.filter((x) => x.id === u.id));

                        selectedModifyAUser.birth_date = dayjs(
                          selectedModifyAUser.birth_date,
                        ).format('YYYY-MM-DD');

                        selectedModifyAUser.created_at = dayjs(
                          selectedModifyAUser.created_at,
                        ).format('YYYY-MM-DD');
                      }
                    "
                    data-bs-toggle="modal"
                    data-bs-target="#modify-a-user"
                    role="button"
                    ><i class="bi bi-pencil-square"></i
                  ></span>
                  <span
                    @click="checkedUsers.push(u.id)"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-a-user"
                    role="button"
                    ><i class="bi bi-trash"></i
                  ></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- footer -->
      <div class="card-footer text-muted">
        <Paginator
          :pagination="pagination"
          @previous="fetchUsers({ currentPage: pagination.currentPage - 1 })"
          @to="(page) => fetchUsers({ currentPage: page })"
          @next="fetchUsers({ currentPage: pagination.currentPage + 1 })"
        />
      </div>
    </div>
  </div>

  <!-- ------------------- modals ------------------------ -->

  <!-- modify a user -->
  <form
    @submit.prevent="modifyUser()"
    class="modal fade px-2 py-5"
    id="modify-a-user"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <!-- content -->
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Modify a user</h5>
          <button
            @click="clearAndDismissModifyAUserModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="modifyAUserLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <!-- image -->
          <div class="row mb-3">
            <!-- image -->
            <div v-if="selectedModifyAUser.profile_picture_url" class="row text-center mb-3">
              <img
                :src="selectedModifyAUser.profile_picture_url"
                class="img-thumbnail mx-auto d-block"
                style="max-width: 50%; height: auto"
              />
            </div>
          </div>

          <!-- name -->
          <div class="row mb-3">
            <!-- first -->
            <div class="col-6">
              <label for="rep" class="form-label">First name</label>
              <input
                id="first_name"
                class="form-control form-control"
                type="text"
                v-model="selectedModifyAUser.first_name"
                :disabled="modifyAUserLoading"
              />
            </div>

            <!-- last -->
            <div class="col-6">
              <label for="weight" class="form-label">Last name</label>
              <input
                id="last_name"
                class="form-control form-control"
                v-model="selectedModifyAUser.last_name"
                type="text"
                :disabled="modifyAUserLoading"
              />
            </div>
          </div>

          <!-- username and body weight -->
          <div class="row mb-3">
            <!-- username -->
            <div class="col-6">
              <label for="username" class="form-label">Username</label>
              <input
                v-model="selectedModifyAUser.username"
                type="text"
                class="form-control"
                id="username"
                disabled
              />
            </div>

            <!-- body weight -->
            <div class="col-6">
              <label for="body_weight" class="form-label">Body weight</label>
              <input
                v-model="selectedModifyAUser.weight"
                type="number"
                class="form-control"
                id="body_weight"
                :disabled="modifyAUserLoading"
              />
            </div>
          </div>

          <!-- status and verified -->
          <div class="row mb-3">
            <!-- status -->
            <div class="col-6">
              <label for="verified" class="form-label">Status</label>
              <select
                class="form-select"
                v-model="selectedModifyAUser.deleted"
                :disabled="modifyAUserLoading"
              >
                <option value="false">Active</option>
                <option value="true">Inactive</option>
              </select>
            </div>

            <!-- verified -->
            <div class="col-6">
              <label for="status" class="form-label">Verification</label>
              <select
                class="form-select"
                v-model="selectedModifyAUser.verified"
                :disabled="modifyAUserLoading"
              >
                <option value="false">Unverified</option>
                <option value="true">Verified</option>
              </select>
            </div>
          </div>

          <!-- date of birth and date created -->
          <div class="row mb-3">
            <!-- date of birth -->
            <div class="col-6">
              <label for="date_of_birth" class="form-label">Date of birth</label>
              <input
                type="date"
                class="form-control"
                id="date_of_birth"
                v-model="selectedModifyAUser.birth_date"
                disabled
              />
            </div>

            <!-- date created -->
            <div class="col-6">
              <label for="created" class="form-label">Date created</label>
              <input
                v-model="selectedModifyAUser.created_at"
                type="date"
                class="form-control"
                id="created"
                disabled
              />
            </div>
          </div>

          <!-- email-->
          <div class="row mb-3">
            <!-- email -->
            <div class="col-12">
              <label for="email" class="form-label">Email</label>
              <input
                v-model="selectedModifyAUser.email"
                type="email"
                class="form-control"
                id="email"
                disabled
              />
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- send reset password link -->
          <button
            type="button"
            @click="sendPasswordResetLink(selectedModifyAUser.email)"
            class="btn btn-success"
            :disabled="sendPasswordResetLinkLoading"
          >
            <div
              v-if="sendPasswordResetLinkLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!sendPasswordResetLinkLoading"
              ><i class="bi bi-check-circle-fill"></i> Send reset password email
            </span>

            <span v-if="sendPasswordResetLinkLoading"> Loading... </span>
          </button>

          <!-- cancel -->
          <button
            @click="clearAndDismissModifyAUserModal()"
            v-if="!modifyAUserLoading"
            type="reset"
            class="btn btn-outline-dark"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-success" :disabled="modifyAUserLoading">
            <div v-if="modifyAUserLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!modifyAUserLoading"><i class="bi bi-check-circle-fill"></i> Update </span>
            <span v-if="modifyAUserLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>

  <!-- add a user -->
  <form
    @submit.prevent="addUser()"
    class="modal fade px-2 py-5"
    id="add-a-user"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <!-- content -->
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">Add a user</h5>
          <button
            @click="clearAndDismissAddAUserModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="addAUserLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <p class="mb-0 pb-0 text-center">add a using stuff here</p>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearAndDismissAddAUserModal()"
            v-if="!addAUserLoading"
            type="reset"
            class="btn btn-outline-dark"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-success" :disabled="addAUserLoading">
            <div v-if="addAUserLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!addAUserLoading"><i class="bi bi-check-circle-fill"></i> Add </span>
            <span v-if="addAUserLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>

  <!-- delete a log -->
  <form
    @submit.prevent="deleteUser()"
    class="modal fade px-2 py-5"
    id="delete-a-user"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <!-- content -->
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h5 class="modal-title">
            <span> User </span>
            <span class="fw-light"> id: {{ checkedUsers.join(', ') }}</span>
          </h5>
          <button
            @click="clearAndDismissDeleteAUserModal()"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="deleteAUserLoading"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body">
          <p class="mb-0 pb-0 text-center">
            <span class="mb-2"> Are you sure you want to delete user(s) the following ID(s)? </span>
            <span class="d-flex justify-content-center flex-wrap gap-1 mb-3">
              <span
                v-for="ck in checkedUsers"
                :key="`checked-user-key-${ck.id}`"
                class="badge bg-secondary text-white"
                >{{ ck }}</span
              >
            </span>
          </p>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearAndDismissDeleteAUserModal()"
            v-if="!deleteAUserLoading"
            type="reset"
            class="btn btn-outline-dark"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle-fill"></i>
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-danger" :disabled="deleteAUserLoading">
            <div v-if="deleteAUserLoading" class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!deleteAUserLoading"><i class="bi bi-check-circle-fill"></i> Delete </span>
            <span v-if="deleteAUserLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* :class="{ 'grayscale text-muted': !u.verified || u.deleted }" */
.grayscale {
  filter: grayscale(100);
  text-decoration: line-through;
}

.pagination > li > a {
  background-color: white;
  color: #212529;
  cursor: pointer;
}

.pagination > li > a:focus,
.pagination > li > a:hover,
.pagination > li > span:focus,
.pagination > li > span:hover {
  color: #5a5a5a;
  background-color: #eee;
  border-color: #ddd;
  cursor: pointer;
}

.pagination > .active > a {
  color: white;
  background-color: #212529 !important;
  border: solid 1px #212529 !important;
  cursor: pointer;
}

.pagination > .active > a:hover {
  background-color: #212529 !important;
  border: solid 1px #ffffff;
  cursor: pointer;
}
</style>
