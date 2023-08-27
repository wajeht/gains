<script setup>
import { onMounted, reactive, ref } from 'vue';
import useAppStore from '../../store/app.store.js';
import useUserStore from '../../store/user.store.js';
import api from '../../../../utils/fetch-with-style.js';
import VideosAndProfileHeader from '../../components/dashboard/headers/VideosAndProfileHeader.vue';

const appStore = useAppStore();
const userStore = useUserStore();
const alert = reactive({
  type: '',
  msg: '',
});

const sessions = ref(null);
// eslint-disable-next-line no-unused-vars
const sessionsPerWeek = ref(4);

onMounted(async () => {
  appStore.loading = true;
  const v = await sessionsWithVideos();

  if (v === undefined || v.length === 0) {
    appStore.loading = false;
    alert.type = 'warning';
    alert.msg = 'There are no session with videos available available at this time!';
  }

  sessions.value = v;
  appStore.loading = false;
});

async function sessionsWithVideos() {
  try {
    const res = await api.get(`/api/v1/sessions/sessions-with-videos/${userStore.user.id}`);
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

    return json.data;
  } catch (e) {
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
}

const numberOfSessionsPerWeek = ref(appStore.numberOfSessionsPerWeek);
function update(number) {
  appStore.numberOfSessionsPerWeek = parseInt(number);
  numberOfSessionsPerWeek.value = parseInt(number);
}
</script>

<template>
  <VideosAndProfileHeader
    :numberOfSessionsPerWeek="numberOfSessionsPerWeek"
    @updateLayout="update"
  />

  <div class="container">
    <div
      v-if="appStore.loading === false"
      class="row my-3 px-3 animate__animated animate__fadeIn animate__faster"
    >
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-3 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- videos -->
      <div
        v-for="session in sessions"
        :key="`key-video-session-${session.id}`"
        class="p-0"
        :style="{ width: 100 / numberOfSessionsPerWeek + '%' }"
      >
        <div class="d-flex flex-column">
          <router-link :to="{ name: 'VideoDetails', params: { id: session.id } }">
            <div class="card border">
              <span class="image-wrapper">
                <img
                  class="card-img-top image"
                  :src="
                    session.videos[0].screenshot_url ??
                    `https://dummyimage.com/200x200/bdbdbd/000000.jpg`
                  "
                  :alt="session.name"
                />
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.col-2 {
  width: 20%;
}

.col-1 {
  width: 16.67%;
}

.col-0 {
  width: 14.286%;
}

.image-wrapper {
  aspect-ratio: 1/1;
  width: auto;
  height: auto;
  overflow: hidden;
}

.image {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
