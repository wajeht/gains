<script setup>
import { reactive, onMounted, onUnmounted, ref, computed } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '@utils/fetch-with-style';
import useUserStore from '../../../store/user.store';
import useAppStore from '../../../store/app.store';
import { useRouter } from 'vue-router';

const props = defineProps({
  username: String,
});

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();

const layoutNumber = ref(appStore.numberOfSessionsPerWeek);

function updateLayout(num) {
  appStore.numberOfSessionsPerWeek = num;
}

// modal backdrop fix
onUnmounted(() => {
  const modal = document.getElementById('layout-settings-modal');
  if (modal && document.body.contains(modal)) {
    document.body.removeChild(modal);
  }
});

const alert = reactive({ type: '', msg: '' });
const profileUser = ref(null);
const isFollowing = ref(false);
const followLoading = ref(false);
const stats = ref({ followers: 0, followings: 0 });
const sessions = ref([]);

// Redirect to own profile if viewing self
const isOwnProfile = computed(() => {
  return profileUser.value?.id === userStore.user.id;
});

onMounted(async () => {
  appStore.loading = true;
  await loadProfile();
  appStore.loading = false;
});

async function loadProfile() {
  try {
    // Get user by username
    const res = await api.get(`/api/v1/users?search=${props.username}`);
    const json = await res.json();

    if (!res.ok) throw json.errors || json.message;

    const user = json.data.find((u) => u.username === props.username);
    if (!user) {
      alert.type = 'danger';
      alert.msg = 'User not found';
      return;
    }

    profileUser.value = user;

    // Redirect to own profile page if viewing self
    if (user.id === userStore.user.id) {
      router.replace(`/dashboard/profile/${userStore.user.username}`);
      return;
    }

    // Check if following and get stats in parallel
    await Promise.all([checkFollowing(), getFollowStats(), getUserVideos()]);
  } catch (e) {
    alert.type = 'danger';
    alert.msg = Array.isArray(e) ? e.map((cur) => cur.msg).join(' ') : e;
  }
}

async function checkFollowing() {
  try {
    const res = await api.get(
      `/api/v1/users/check-following?follower_id=${userStore.user.id}&following_id=${profileUser.value.id}`,
    );
    const json = await res.json();
    if (res.ok) {
      isFollowing.value = json.data.following;
    }
  } catch (e) {
    console.error('Error checking follow status', e);
  }
}

async function getFollowStats() {
  try {
    const res = await api.get(`/api/v1/users/${profileUser.value.id}/followers`);
    const json = await res.json();
    if (res.ok && json.data[0]?.user) {
      stats.value.followers = json.data[0].user.followers?.length || 0;
      stats.value.followings = json.data[0].user.followings?.length || 0;
    }
  } catch (e) {
    console.error('Error getting follow stats', e);
  }
}

async function toggleFollow() {
  try {
    followLoading.value = true;
    const res = await api.post(`/api/v1/users/${profileUser.value.id}/follow`, {
      follower_id: userStore.user.id,
    });
    const json = await res.json();

    if (!res.ok) throw json.errors || json.message;

    isFollowing.value = json.data.following;
    await getFollowStats();
  } catch (e) {
    alert.type = 'danger';
    alert.msg = Array.isArray(e) ? e.map((cur) => cur.msg).join(' ') : e;
  } finally {
    followLoading.value = false;
  }
}

async function getUserVideos() {
  try {
    const res = await api.get(`/api/v1/sessions/sessions-with-videos/${profileUser.value.id}`);
    const json = await res.json();
    if (res.ok) {
      sessions.value = json.data || [];
    }
  } catch (e) {
    console.error('Error getting user videos', e);
  }
}
</script>

<template>
  <Backheader />

  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster"
  >
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- profile card -->
      <div v-if="profileUser" class="card">
        <div class="card-body">
          <div class="row g-3">
            <!-- avatar -->
            <div class="col-4 d-flex flex-column justify-content-center align-items-center">
              <span class="image-wrapper">
                <img
                  :src="
                    profileUser.profile_picture_url ||
                    'https://dummyimage.com/200x200/bdbdbd/000000.jpg'
                  "
                  class="rounded-circle image"
                />
              </span>
            </div>

            <!-- info -->
            <div class="col-8">
              <h5 class="card-title mb-1">
                {{ profileUser.first_name }} {{ profileUser.last_name }}
              </h5>
              <small class="text-muted">@{{ profileUser.username }}</small>
              <p v-if="profileUser.bio" class="card-text mt-2">
                <small>{{ profileUser.bio }}</small>
              </p>

              <!-- action buttons -->
              <div class="d-flex gap-2 mt-3">
                <button
                  @click="toggleFollow"
                  class="btn btn-sm"
                  :class="isFollowing ? 'btn-outline-dark' : 'btn-dark'"
                  :disabled="followLoading"
                >
                  <span v-if="followLoading" class="spinner-border spinner-border-sm"></span>
                  <span v-else>{{ isFollowing ? 'Unfollow' : 'Follow' }}</span>
                </button>
                <router-link
                  :to="`/dashboard/chat/${profileUser.id}`"
                  class="btn btn-sm btn-outline-dark"
                >
                  <i class="bi bi-chat"></i> Message
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- stats footer -->
        <div class="card-footer d-flex justify-content-evenly">
          <div class="d-flex flex-column align-items-center">
            <small>{{ stats.followers }}</small>
            <small class="text-muted">Followers</small>
          </div>
          <div class="d-flex flex-column align-items-center">
            <small>{{ stats.followings }}</small>
            <small class="text-muted">Following</small>
          </div>
        </div>
      </div>

      <!-- videos header -->
      <div v-if="sessions.length" class="d-flex justify-content-between align-items-center">
        <small class="text-muted">Videos</small>
        <span
          data-bs-toggle="modal"
          data-bs-target="#layout-settings-modal"
          class="text-muted"
          role="button"
        >
          <i class="bi bi-grid-3x3-gap"></i>
        </span>
      </div>

      <!-- videos grid -->
      <div v-if="sessions.length" class="d-flex flex-wrap gap-1">
        <router-link
          v-for="session in sessions"
          :key="`video-${session.id}`"
          :to="`/dashboard/videos/${session.id}`"
          :style="{ width: `calc(${100 / appStore.numberOfSessionsPerWeek}% - 4px)` }"
        >
          <div class="d-flex flex-column">
            <div class="card border">
              <span class="video-wrapper">
                <img
                  class="card-img-top video-thumb"
                  :src="
                    session.videos[0]?.youtube_thumbnail ||
                    'https://dummyimage.com/200x200/bdbdbd/000000.jpg'
                  "
                  :alt="session.name"
                />
              </span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- no videos -->
      <div v-else class="text-center text-muted py-3">
        <small>No videos yet</small>
      </div>
    </div>
  </div>

  <!-- layout settings modal -->
  <div
    class="modal fade px-2 py-5"
    id="layout-settings-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Layout settings</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center">
          <div class="mb-4">
            <h1>{{ layoutNumber }}</h1>
          </div>
          <div class="mb-3">
            <label for="layout-range" class="form-label">Videos per row</label>
            <input
              v-model="layoutNumber"
              type="range"
              class="form-range w-100"
              min="1"
              max="7"
              step="1"
              id="layout-range"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
          <button
            @click="updateLayout(layoutNumber)"
            type="button"
            data-bs-dismiss="modal"
            class="btn btn-success"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-wrapper {
  aspect-ratio: 1/1;
  width: 100%;
  max-width: 120px;
  overflow: hidden;
}

.image {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.video-wrapper {
  aspect-ratio: 1/1;
  width: 100%;
  overflow: hidden;
  display: block;
}

.video-thumb {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
