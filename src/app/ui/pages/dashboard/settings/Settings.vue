<script setup>
import DashboardHeader from '../../../components/dashboard/DashboardHeader.vue';
import useAppStore from '../../../store/app.store.js';
import useUserSore from '../../../store/user.store.js';
import api from '../../../../../utils/fetch-with-style.js';
import LogoutButton from '../../../components/dashboard/LogoutButton.vue';

import { ref, reactive } from 'vue';

const clearAllCacheLoading = ref(false);
const downloadUserDataLoading = ref(false);

const alert = reactive({
  type: '',
  msg: '',
});

const appStore = useAppStore();
const userStore = useUserSore();

const deleteAllDataOfAUserLoading = ref(false);

async function deleteAllDataOfAUser() {
  try {
    deleteAllDataOfAUserLoading.value = true;

    const res = await api.delete(`/api/v1/users/${userStore.user.id}/data`);
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

    deleteAllDataOfAUserLoading.value = false;
    clearAndDismissModal('delete-all-data-of-a-user');

    alert.type = 'success';
    alert.msg = 'All user training data has been deleted!';
  } catch (e) {
    clearAndDismissModal('delete-all-data-of-a-user');
    deleteAllDataOfAUserLoading.value = false;
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

async function downloadUserData() {
  try {
    downloadUserDataLoading.value = true;

    const res = await api.get(`/api/v1/users/${userStore.user.id}/download-user-data`);
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

    downloadUserDataLoading.value = false;

    alert.type = 'success';
    alert.msg = 'Request has been sent successfully. We will email you after processing the data!';
  } catch (e) {
    appStore.loading = false;
    downloadUserDataLoading.value = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

function clearAndDismissModal(modalId) {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId));
  modal.hide();
}

async function clearAllCache() {
  try {
    clearAllCacheLoading.value = true;
    const res = await api.post(`/api/v1/cache/user/${userStore.user.id}`);
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

    clearAllCacheLoading.value = false;

    alert.type = 'success';
    alert.msg = 'Cache has been cleared!';

    window.scrollTo(0, 0);
  } catch (e) {
    appStore.loading = false;
    clearAllCacheLoading.value = false;
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
  <!-- header -->
  <DashboardHeader />

  <!-- settings -->
  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="flex flex-column justify-content-between my-3" v-auto-animate>
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- setting items -->
      <div class="d-flex flex-column gap-3">
        <!-- User -->
        <div>
          <!-- title -->
          <h5><i class="bi bi-person-fill"></i> User</h5>

          <div class="list-group">
            <!-- user details -->
            <router-link
              to="/dashboard/settings/account/user-details"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">User details</h6>
                  <p class="mb-0 opacity-75">Change user account details.</p>
                </div>
              </div>
            </router-link>

            <!-- delete  -->
            <router-link
              to="/dashboard/settings/account/delete-account"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">
                    Delete your account
                    <!-- <small class="bg-danger text-white px-1 rounded" style="padding-bottom: 2.5px"
                        >warning</small
                      > -->
                  </h6>
                  <p class="mb-0 opacity-75">This action cannot be revert back to normal state!</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- data -->
        <div>
          <h5><i class="bi bi-file-earmark-bar-graph"></i> Data</h5>
          <div class="list-group">
            <!-- download -->
            <span
              @click="downloadUserData()"
              :style="{
                background: downloadUserDataLoading ? '#f1f1f1' : '',
                cursor: !downloadUserDataLoading ? 'pointer' : '',
              }"
              :class="{ disabled: downloadUserDataLoading }"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Download your data</h6>
                  <p class="mb-0 opacity-75">Export all of your data via CSV format!</p>
                </div>

                <!-- loading -->
                <div
                  v-if="downloadUserDataLoading"
                  class="spinner-border spinner-border-sm text-muted"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </span>

            <!-- delete data -->
            <span
              role="button"
              data-bs-toggle="modal"
              data-bs-target="#delete-all-data-of-a-user"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Delete all data</h6>
                  <p class="mb-0 opacity-75">One click to wipe your data, but not account!</p>
                </div>
                <!-- <small class="opacity-50 text-nowrap">v1</small> -->
              </div>
            </span>

            <!-- api-key -->
            <router-link
              to="/dashboard/settings/data/api-keys"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Request API Key</h6>
                  <p class="mb-0 opacity-75">Want to consume your data via api? That's great!</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- app setting -->
        <div>
          <!-- title -->
          <h5><i class="bi bi-gear-fill"></i> App</h5>

          <div class="list-group">
            <!-- clear all cache -->
            <span
              @click="clearAllCache()"
              :style="{
                background: clearAllCacheLoading ? '#f1f1f1' : '',
                cursor: !clearAllCacheLoading ? 'pointer' : '',
              }"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
              :class="{ disabled: clearAllCacheLoading }"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Clear all cache</h6>
                  <p class="mb-0">Latest application data without cache</p>
                </div>

                <!-- <small class="opacity-50 text-nowrap">v1</small> -->

                <!-- loading -->
                <div
                  v-if="clearAllCacheLoading"
                  class="spinner-border spinner-border-sm text-muted"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </span>

            <!-- change unit -->
            <div
              @click="appStore.changeUnit()"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
              role="button"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Change unit</h6>
                  <p class="mb-0 opacity-75">Change unit to kg. or lbs.</p>
                </div>
                <div class="form-check form-switch form-check-reverse">
                  <input
                    v-model="appStore.unit.toggle"
                    class="form-check-input"
                    type="checkbox"
                    id="settings-toggle-unit"
                  />
                  <label
                    @click="appStore.changeUnit()"
                    style="cursor: pointer"
                    class="form-check-label"
                    for="settings-toggle-unit"
                    >{{ appStore.unitLabel }}</label
                  >
                </div>
              </div>
            </div>

            <!-- theme -->
            <div
              @click="appStore.changeTheme()"
              role="button"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">System theme</h6>
                  <p class="mb-0 opacity-75">Change theme to light or dark</p>
                </div>
                <div class="form-check form-check-reverse form-switch">
                  <label
                    @click="appStore.changeTheme()"
                    style="cursor: pointer"
                    class="form-check-label"
                    for="light-or-dark"
                  >
                    <span v-if="appStore.darkMode === true">dark</span>
                    <span v-if="appStore.darkMode === false">light</span>
                  </label>
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="light-or-dark"
                    v-model="appStore.darkMode"
                  />
                </div>
              </div>
            </div>

            <!-- enable community sessions -->
            <div
              @click="appStore.community = !appStore.community"
              role="button"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Community</h6>
                  <p class="mb-0 opacity-75">Enable or Disable community feature</p>
                </div>
                <div class="form-check form-switch form-check-reverse">
                  <input
                    class="form-check-input"
                    v-model="appStore.community"
                    type="checkbox"
                    id="enable-disable-community"
                  />
                  <label
                    style="cursor: pointer"
                    class="form-check-label"
                    for="enable-disable-community"
                  >
                    <span @click="appStore.community = false" v-if="appStore.community"
                      >enable</span
                    >
                    <span @click="appStore.community = true" v-else>disable</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- others -->
        <div>
          <h5><i class="bi bi-code-slash"></i> Others</h5>
          <div class="list-group">
            <!-- admin panel -->
            <router-link
              v-if="userStore.user.role === 'admin'"
              to="/admin"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Admin Panel</h6>
              </div>
            </router-link>

            <!-- api docs -->
            <a
              href="/docs/api/"
              target="_blank"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">API Docs</h6>
              </div>
            </a>

            <!-- help -->
            <router-link
              to="/dashboard/settings/others/help-and-support"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Help and Support</h6>
              </div>
            </router-link>

            <!-- send -->
            <router-link
              to="/dashboard/settings/others/send-feedback"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Send Feedback</h6>
              </div>
            </router-link>

            <!-- changelog -->
            <router-link
              to="/dashboard/settings/others/changelogs"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Changelogs</h6>
              </div>
            </router-link>

            <!-- terms -->
            <router-link
              to="/dashboard/settings/others/terms"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Terms of Service</h6>
              </div>
            </router-link>

            <!-- privacy -->
            <router-link
              to="/dashboard/settings/others/privacy"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Privacy Policy</h6>
              </div>
            </router-link>

            <!-- issues/pull requests -->
            <router-link
              to="/dashboard/settings/others/issues-and-pull-requests"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Issues and Pull requests</h6>
              </div>
            </router-link>
          </div>
        </div>

        <LogoutButton />
      </div>

      <!-- footer -->
      <div class="text-center text-muted mt-3">
        <span class="d-flex flex-column justify-content-between">
          <!-- version -->
          <small>
            Version:
            <router-link
              class="link-secondary text-decoration-none"
              to="/dashboard/settings/others/changelogs"
            >
              {{ appStore.appVersion }}
            </router-link>
          </small>

          <!-- copyright -->
          <small>
            Made with ❤️ by
            <a
              href="https://www.github.com/wajeht"
              class="link-secondary text-decoration-none"
              target="_blank"
              >@wajeht</a
            >
            and other
            <a
              href="https://www.github.com/wajeht/gains"
              class="link-secondary text-decoration-none"
              target="_blank"
              >contributors</a
            >
          </small>
        </span>
      </div>
    </div>
  </div>

  <!-- delete all data of a  user modal -->
  <form
    @submit.prevent="deleteAllDataOfAUser()"
    class="modal fade px-2 py-5"
    id="delete-all-data-of-a-user"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm</h5>
          <button
            @click="clearAndDismissModal('delete-all-data-of-a-user')"
            type="reset"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="deleteAllDataOfAUserLoading"
          ></button>
        </div>
        <div class="modal-body">
          <p class="mb-0 pb-0 text-center">
            Are you sure you want to delete all of your data? This cannot be undone!
          </p>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <!-- cancel -->
          <button
            @click="clearAndDismissModal('delete-all-data-of-a-user')"
            v-if="!deleteAllDataOfAUserLoading"
            type="reset"
            class="btn btn-outline-dark"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>

          <!-- confirm -->
          <button type="submit" class="btn btn-dark" :disabled="deleteAllDataOfAUserLoading">
            <div
              v-if="deleteAllDataOfAUserLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>

            <span v-if="!deleteAllDataOfAUserLoading"> Confirm </span>
            <span v-if="deleteAllDataOfAUserLoading"> Loading... </span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
