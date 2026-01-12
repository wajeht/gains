<script setup>
import { reactive, onMounted, computed } from 'vue';
import Backheader from '../../../components/dashboard/headers/Backheader.vue';
import api from '@utils/fetch-with-style';
import useUserStore from '../../../store/user.store';
import useAppStore from '../../../store/app.store';
import { useRoute } from 'vue-router';

const props = defineProps({
  username: String,
});

const alert = reactive({
  type: '',
  msg: '',
});

const appStore = useAppStore();
const userStore = useUserStore();
const route = useRoute();

const states = reactive({
  links: [
    { id: 1, label: 'Followings' },
    { id: 2, label: 'Followers' },
  ],
  user: {},
  currentLink: 'Followings',
  loadingUserId: null,
});

onMounted(async () => {
  appStore.loading = true;
  const tab = route.query.tab;

  if (tab === 'Followers') {
    states.currentLink = 'Followers';
  }

  if (tab === 'Followings') {
    states.currentLink = 'Followings';
  }

  await getMyFollowers();
  appStore.loading = false;
});

const computedList = computed(() => {
  if (states.currentLink === 'Followers') {
    return states.user.followers;
  } else {
    return states.user.followings;
  }
});

async function getMyFollowers() {
  try {
    appStore.loading = true;

    const res = await api.get(`/api/v1/users/${userStore.user.id}/followers`);
    const json = await res.json();
    if (res.status >= 500) {
      throw new Error('Server error. Please try again later!');
    }
    if (!res.ok) {
      throw json.errors || json.message;
    }
    states.user = json.data[0].user;
  } catch (e) {
    appStore.loading = false;
    alert.type = 'danger';
    alert.msg = Array.isArray(e) ? e.map((cur) => cur.msg).join(' ') : e;
  }
}

async function toggleFollow(userId) {
  try {
    states.loadingUserId = userId;

    const res = await api.post(`/api/v1/users/${userId}/follow`, {
      follower_id: userStore.user.id,
    });
    const json = await res.json();

    if (!res.ok) {
      throw json.errors || json.message;
    }

    // Refresh the list
    await getMyFollowers();
  } catch (e) {
    alert.type = 'danger';
    alert.msg = Array.isArray(e) ? e.map((cur) => cur.msg).join(' ') : e;
  } finally {
    states.loadingUserId = null;
  }
}

async function removeFollower(userId) {
  try {
    states.loadingUserId = userId;

    // To remove a follower, we toggle from their perspective
    // (they unfollow us)
    const res = await api.post(`/api/v1/users/${userStore.user.id}/follow`, {
      follower_id: userId,
    });
    const json = await res.json();

    if (!res.ok) {
      throw json.errors || json.message;
    }

    // Refresh the list
    await getMyFollowers();
  } catch (e) {
    alert.type = 'danger';
    alert.msg = Array.isArray(e) ? e.map((cur) => cur.msg).join(' ') : e;
  } finally {
    states.loadingUserId = null;
  }
}

const computedCurrentLinkClass = (link) => {
  return states.currentLink === link.label ? 'bg-white border' : 'text-muted';
};

function setActive(link) {
  states.currentLink = link.label;
}
</script>

<template>
  <!-- header -->
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

      <div class="d-flex flex-column">
        <!-- tab -->
        <div class="d-flex justify-content-evenly rounded">
          <h6
            id="follow"
            v-for="link in states.links"
            :key="link.id"
            role="button"
            @click="setActive(link)"
            :class="['w-100 m-0 text-center rounded', computedCurrentLinkClass(link)]"
            style="
              padding-top: 12px;
              padding-bottom: 12px;
              border-bottom: 0px !important;
              border-bottom-left-radius: 0px !important;
              border-bottom-right-radius: 0px !important;
            "
          >
            {{ link.label }}
          </h6>
        </div>

        <!-- card -->
        <div
          class="list-group"
          style="border-top-left-radius: 0px !important; border-top-right-radius: 0px !important"
        >
          <span v-if="computedList?.length">
            <div
              v-for="user in computedList"
              :key="user.id"
              class="list-group-item d-flex gap-3 align-items-center justify-content-between py-3"
            >
              <!-- name and image -->
              <router-link :to="`/dashboard/profile/${user.username}`">
                <div class="d-flex gap-3 align-items-center">
                  <!-- image -->
                  <div>
                    <img
                      :src="
                        user.profile_picture_url ||
                        'https://dummyimage.com/200x200/bdbdbd/000000.jpg'
                      "
                      class="rounded-circle image"
                      style="max-width: 50px; height: 50px; object-fit: cover"
                    />
                  </div>
                  <!-- name -->
                  <div>
                    <h6 class="m-0 p-0">{{ user.username }}</h6>
                    <p class="text-muted m-0 p-0">{{ user.first_name }} {{ user.last_name }}</p>
                  </div>
                </div>
              </router-link>

              <!-- action buttons -->
              <div class="d-flex gap-2">
                <!-- message button -->
                <router-link :to="`/dashboard/chat/${user.id}`" class="btn btn-sm btn-outline-dark">
                  <i class="bi bi-chat"></i>
                </router-link>

                <!-- follow/unfollow or remove button -->
                <button
                  v-if="states.currentLink === 'Followings'"
                  @click="toggleFollow(user.id)"
                  class="btn btn-sm btn-dark"
                  :disabled="states.loadingUserId === user.id"
                >
                  <span
                    v-if="states.loadingUserId === user.id"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  <span v-else>Unfollow</span>
                </button>
                <button
                  v-if="states.currentLink === 'Followers'"
                  @click="removeFollower(user.id)"
                  class="btn btn-sm btn-outline-danger"
                  :disabled="states.loadingUserId === user.id"
                >
                  <span
                    v-if="states.loadingUserId === user.id"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  <span v-else>Remove</span>
                </button>
              </div>
            </div>
          </span>

          <!-- empty -->
          <div v-else class="list-group-item">
            <small class="text-muted fw-light d-flex justify-content-center py-3">
              No {{ states.currentLink.toLowerCase() }} yet
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #191919;
  text-decoration: none;
}

a:hover {
  color: #191919;
}

#follow:hover {
  color: #191919 !important;
}
</style>
