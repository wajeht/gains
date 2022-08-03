<script setup>
import { onMounted, reactive, ref } from 'vue';
import useAppStore from '../../store/app.store.js';
import useUserStore from '../../store/user.store.js';
import DashboardHeader from '../../components/dashboard/DashboardHeader.vue';
import api from '../../../../utils/fetch-with-style.js';

const appStore = useAppStore();
const userStore = useUserStore();
const alert = reactive({
  type: '',
  msg: '',
});

const sessions = ref(null);

onMounted(async () => {
  appStore.loading = true;
  const v = await sessionsWithVideos();

  if (v === undefined) {
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
</script>

<template>
  <DashboardHeader />

  <div class="container">
    <!-- <div v-if="appStore.loading === false" class="row my-3 px-3"> -->
    <div class="row my-3 px-3" v-auto-animate>
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-3 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- videos -->
      <div
        v-for="session in sessions"
        :key="`key-video-session-${session.id}`"
        class="p-0"
        :class="{
          'col-12': sessions.length === 1,
          'col-6': sessions.length === 2,
          'col-4': sessions.length === 3,
          'col-3': sessions.length >= 4,
        }"
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
