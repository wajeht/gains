<script setup>
import useAppStore from '../../../store/app.store.js';
const appStore = useAppStore();
</script>
<template>
  <!-- header -->
  <DashboardHeader />

  <!-- settings -->
  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="flex flex-column justify-content-between my-3">
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
                  <label class="form-check-label" for="settings-toggle-unit">{{
                    appStore.unitLabel
                  }}</label>
                </div>
              </div>
            </div>

            <!-- delete  -->
            <router-link
              to="/dashboard/settings/account/delete-account"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">
                    Delete your account
                    <small class="bg-danger text-white px-1 rounded" style="padding-bottom: 2.5px"
                      >warning</small
                    >
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
            <!-- email -->
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Delete all data</h6>
                  <p class="mb-0 opacity-75">One click to wipe your data, but not account!</p>
                </div>
                <!-- <small class="opacity-50 text-nowrap">v1</small> -->
              </div>
            </a>

            <!-- csv -->
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Download your data</h6>
                  <p class="mb-0 opacity-75">Export all of your data via CSV format!</p>
                </div>
                <!-- <small class="opacity-50 text-nowrap">v1</small> -->
              </div>
            </a>

            <!-- api-key -->
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Request API Key</h6>
                  <p class="mb-0 opacity-75">Want to consume your data via api? That's great!</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- others -->
        <div>
          <h5><i class="bi bi-code-slash"></i> Others</h5>
          <div class="list-group">
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
          </div>
        </div>
      </div>

      <!-- footer -->
      <div class="text-center text-muted mt-3">
        <span class="d-flex flex-column justify-content-between">
          <!-- version -->
          <small>
            Version:
            <a href="#" class="link-secondary text-decoration-none" target="_blank">1.0.0</a>
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
              href="https://www.github.com/allkindsofgains"
              class="link-secondary text-decoration-none"
              target="_blank"
              >contributors</a
            >
          </small>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardHeader from '../../../components/dashboard/DashboardHeader.vue';

export default {
  components: {
    DashboardHeader,
  },
};
</script>
