<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
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

const alert = reactive({ type: '', msg: '' });
const profileUser = ref(null);
const isFollowing = ref(false);
const followLoading = ref(false);
const stats = ref({ followers: 0, followings: 0 });

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

    // Check if following
    await checkFollowing();

    // Get follower stats
    await getFollowStats();
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
</style>
