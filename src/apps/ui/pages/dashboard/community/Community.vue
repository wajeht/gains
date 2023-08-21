<script setup>
import { onMounted, ref, reactive } from 'vue';
import dayjs from 'dayjs';
import DashboardHomeHeader from '../../../components/dashboard/headers/DashboardHomeHeader.vue';
import api from '../../../../../utils/fetch-with-style.js';
import { useRouter, useRoute } from 'vue-router';

import useUserStore from '../../../store/user.store.js';
import useAppStore from '../../../store/app.store.js';

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const loading = ref(false);

const sessions = ref([]);
const pagination = reactive({
  perPage: 25,
  currentPage: 0,
  details: null,
  lastPage: null,
});

const alert = reactive({
  type: '',
  msg: '',
});

onMounted(async () => {
  appStore.loading = true;
  await getSessions();
  pagination.lastPage = pagination.details?.lastPage;
  appStore.loading = false;
});

async function getSessions() {
  try {
    pagination.currentPage++;
    loading.value = true; // loading more button

    const res = await api.get(`/api/v1/sessions/community-sessions?perPage=${pagination.perPage}&currentPage=${pagination.currentPage}`); // prettier-ignore
    const json = await res.json();

    if (json.data?.length === 0) {
      appStore.loading = false;
      alert.type = 'warning';
      alert.msg =
        'There are no community session with videos available available at this time! Please add a session via click the plus icon!';
      return;
    }

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    pagination.details = json.pagination;

    if (sessions.value?.length === 0) {
      sessions.value = json.data.filter((ss) => ss.logs.length);

      sessions.value.forEach((ss) => {
        if (ss.logs.length) {
          ss.logs['currentLogStep'] = 0;
        }
      });
    } else {
      loading.value = true; // loading more button
      json.data.forEach((ss) => {
        if (ss.logs.length) {
          sessions.value.push(ss);
          ss.logs['currentLogStep'] = 0;
        }
      });
      loading.value = false;
    }

    loading.value = false; // loading more button
  } catch (e) {
    appStore.loading = false;
    loading.value = false; // loading more button
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
  <DashboardHomeHeader />

  <div v-if="!appStore.loading" class="animate__animated animate__fadeIn animate__faster">
    <div class="container px-3">
      <div class="my-3 d-flex flex-column gap-3">
        <!-- alert -->
        <div v-if="alert.type" :class="`alert-${alert.type}`" class="alert mb-0">
          <span>{{ alert.msg }}</span>
        </div>

        <!-- card -->
        <div
          v-for="s in sessions"
          :key="`dashboard-home-videos-key-${s.session_id}`"
          class="card shadow-sm border"
        >
          <!-- card header -->
          <div class="d-flex justify-content-between align-items-center card-header">
            <!-- left -->
            <div class="d-flex d-flex justify-content-between align-items-center">
              <img
                :src="s.profile_picture_url ?? `https://dummyimage.com/200x200/bdbdbd/000000.jpg`"
                width="24"
                height="24"
                class="rounded-circle me-1"
              />
              <span class="d-flex justify-content-between align-items-center gap-1">
                <!-- name -->
                <span
                  v-if="userStore.user.id == s.user_id"
                  role="button"
                  @click="router.push('/dashboard/profile')"
                  >{{ s.username }}</span
                >
                <span v-else>{{ s.username }}</span>
                <!-- checkmark -->
                <small v-if="userStore.user.id === s.user_id">
                  <i class="bi bi-check-circle-fill text-primary"></i>
                </small>
              </span>
            </div>

            <!-- right -->
            <div
              class="d-flex justify-content-between gap-3 fw-light fst-italic"
              style="overflow: hidden !important"
            >
              <!-- session name -->
              <small class="d-inline-block text-truncate" style="max-width: 15rem">
                <router-link
                  v-if="userStore.user.id == s.user_id"
                  :to="`/dashboard/sessions/${s.session_id}`"
                  class="link-secondary text-decoration-none"
                  >{{ s.name }}
                </router-link>
                <span v-else>
                  {{ s.name }}
                </span>
              </small>
            </div>
          </div>

          <span v-for="(log, index) in s.logs" :key="`key-video-details${log?.id}`">
            <!-- log -->
            <span v-if="s.logs?.currentLogStep === index">
              <!-- video -->
              <div v-if="log?.videos?.length" class="card card-body p-0 m-0 border-0">
                <div class="video-wrapper">
                  <video
                    class="video"
                    preload="none"
                    :poster="log?.videos[0].screenshot_url"
                    controls
                    playsinline
                    muted
                  >
                    <source :src="`/api/v1/videos/${log?.videos[0].id}/stream`" type="video/mp4" />
                  </video>
                </div>
              </div>

              <!-- dots -->
              <div v-if="s.logs?.length > 1" class="d-flex gap-2 justify-content-center m-0 p-0">
                <div
                  role="button"
                  @click="s.logs.currentLogStep = i"
                  v-for="(l, i) in s.logs"
                  :key="`key-dot-${l.id}`"
                >
                  <i
                    class="bi m-0 p-0"
                    :class="{
                      'bi-circle-fill': s.logs?.currentLogStep === i,
                      'bi-circle': s.logs?.currentLogStep !== i,
                    }"
                    style="font-size: 0.6rem"
                  ></i>
                </div>
              </div>

              <!-- body -->
              <div class="card-body">
                <!-- title group -->
                <div class="d-flex gap-3 align-items-center">
                  <!-- title -->
                  <h5 class="card-title">{{ log.name }}</h5>

                  <!-- tags -->
                  <small v-if="log.tags" class="d-flex gap-2 mb-2">
                    <small
                      v-for="t in log?.tags"
                      class="fw-light text-muted rounded px-2 d-block"
                      style="background-color: #ededed"
                      >{{ t.name }}</small
                    >
                  </small>
                </div>

                <!-- sets -->
                <p class="card-text">
                  <!-- notes -->
                  <span>
                    {{ log.notes }}
                  </span>

                  <!-- sets -->
                  <span
                    class="d-flex flex-column"
                    :class="{ 'pt-0': !log.notes, 'pt-2': log.notes }"
                  >
                    <small v-for="set in log.sets.slice(0, 5)" :key="`key-set-${set.id}`">
                      1 set(s) x {{ set.reps }} rep(s) x {{ set.weight }}
                      {{ appStore.unitLabel }} @{{ set.rpe }}
                      rpe
                      {{ set.notes ? `- ${set.notes}` : '' }}
                    </small>
                    <small v-if="log.sets.length > 5" class="text-muted p-0 m-0">.......</small>
                  </span>
                </p>
              </div>

              <!-- footer -->
              <div class="card-footer">
                <span class="d-flex justify-content-between text-muted">
                  <!-- left -->
                  <span class="d-flex gap-2">
                    <!-- date -->
                    <small
                      ><i class="bi bi-calendar-check me-1"></i
                      >{{ dayjs(s.created_at).format('YYYY/MM/DD') }}</small
                    >

                    <!-- session -->
                    <small>
                      <router-link
                        v-if="userStore.user.id === s.user_id"
                        class="link-secondary text-decoration-none"
                        :to="`/dashboard/sessions/${s.session_id}`"
                        ><i class="bi bi-journal-text"> </i>
                        {{ s.session_id }}
                      </router-link>
                    </small>

                    <!-- block -->
                    <small v-if="s.block_name">
                      <router-link
                        :to="`/dashboard/blocks/${s.block_id}`"
                        class="link-secondary text-decoration-none"
                      >
                        <i class="bi bi-bricks me-1"></i>{{ s.block_name }}
                      </router-link>
                    </small>
                  </span>

                  <!-- right -->
                  <div class="d-flex gap-2">
                    <!-- comment -->
                    <small v-if="appStore.community">
                      <router-link
                        :to="`/dashboard/videos/${s.session_id}`"
                        class="link-secondary text-decoration-none"
                        ><i class="bi bi-chat me-1"></i>{{ s.counts_of_comments }}</router-link
                      >
                    </small>
                  </div>
                </span>
              </div>
            </span>
          </span>
        </div>

        <!-- load more -->
        <button
          v-if="pagination.details?.currentPage !== pagination.lastPage && sessions.length"
          @click="getSessions()"
          type="button"
          class="btn btn-success"
          :disabled="loading"
        >
          <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>

          <span v-if="!loading"> Load more </span>
          <span v-if="loading"> Loading... </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-wrapper {
  aspect-ratio: 1/1;
  width: auto;
  height: auto;
  overflow: hidden;
}

.video {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

video::-webkit-media-controls {
  visibility: hidden;
}

video::-webkit-media-controls-enclosure {
  visibility: visible;
}
</style>
