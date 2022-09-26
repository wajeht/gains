<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// this code below required for back drop problem fixed when adding a new session header model
onMounted(() => {
  if (route.path === '/dashboard/videos') {
    document.body.appendChild(document.getElementById(`update-videos-settings-layout`));
  }
});

onUnmounted(() => {
  if (route.path !== '/dashboard/videos') {
    if (document.getElementById(`update-videos-settings-layout`)) {
      document.body.removeChild(document.getElementById(`update-videos-settings-layout`));
    }
  }
});
// this code above required for back drop problem fixed when adding a new session header model

const updateVideosSettingsLoading = ref(false);

const props = defineProps({
  numberOfSessionsPerWeek: {
    type: Number,
  },
});

const number = ref(props.numberOfSessionsPerWeek);
</script>

<template>
  <div
    id="videos-and-profile-header"
    style="height: 64px"
    class="container sticky-top d-flex justify-content-between align-items-center bg-white border-bottom py-3 gap-3"
  >
    <!-- videos view -->
    <router-link
      v-if="route.path === '/dashboard/videos'"
      to="/dashboard/profile"
      class="link-secondary"
      role="button"
    >
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="user" />
        <span>Profile layout</span>
      </h5>
    </router-link>

    <!-- videos settings -->
    <span
      v-if="route.path === '/dashboard/videos'"
      data-bs-toggle="modal"
      data-bs-target="#update-videos-settings-layout"
      class="link-secondary"
      role="button"
    >
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="bars" />
      </h5>
    </span>

    <!-- profile view -->
    <router-link
      v-if="route.path === '/dashboard/profile'"
      to="/dashboard/videos"
      class="link-secondary"
      role="button"
    >
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="play" />
        <span>Videos layout</span>
      </h5>
    </router-link>

    <!-- profile settings -->
    <span
      v-if="route.path === '/dashboard/profile'"
      @click="router.push('/dashboard/settings/account/user-details')"
      class="link-secondary"
      role="button"
    >
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="gear" />
      </h5>
    </span>

    <!-- modal -->
    <form
      v-if="route.path === '/dashboard/videos'"
      class="modal fade px-2 py-5"
      id="update-videos-settings-layout"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header">
            <h5 class="modal-title">
              <span> Update videos layout settings </span>
            </h5>
            <button type="reset" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <!-- body -->
          <div class="modal-body text-center">
            <!-- number -->
            <div class="mb-4">
              <h1>{{ number }}</h1>
            </div>

            <!-- range -->
            <div class="mb-3">
              <label for="session-range" class="form-label">Number of sessions per week</label>
              <br />
              <input
                v-model="number"
                type="range"
                class="form-range w-100"
                min="1"
                max="7"
                step="1"
                id="session-range"
              />
            </div>
          </div>

          <!-- footer -->
          <div class="modal-footer">
            <!-- cancel -->
            <button
              v-if="!updateVideosSettingsLoading"
              type="reset"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              <i class="bi bi-x-circle-fill"></i>
              Cancel
            </button>

            <!-- add -->
            <button
              @click="$emit('updateLayout', number)"
              type="button"
              data-bs-dismiss="modal"
              class="btn btn-success"
              :disabled="updateVideosSettingsLoading"
            >
              <div
                v-if="updateVideosSettingsLoading"
                class="spinner-border spinner-border-sm"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <span v-if="!updateVideosSettingsLoading">
                <i class="bi bi-check-circle-fill"></i>
                Submit
              </span>
              <span v-if="updateVideosSettingsLoading"> Loading... </span>
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
