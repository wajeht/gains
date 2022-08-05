<script setup>
import DashboardHomeHeader from '../../components/dashboard/headers/DashboardHomeHeader.vue';
import api from '../../../../utils/fetch-with-style.js';
import { useRouter, useRoute } from 'vue-router';

import useUserStore from '../../store/user.store.js';
import useAppStore from '../../store/app.store.js';

const userStore = useUserStore();
const appStore = useAppStore();

import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();

import { onMounted, ref } from 'vue';

const sessions = ref([]);

onMounted(async () => {
  appStore.loading = true;
  const s = await getSessions();
  sessions.value = s || [];
  appStore.loading = false;
});

async function getSessions() {
  try {
    const res = await api.get(`/api/v1/sessions/community-sessions`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    json.data.forEach((ss) => {
      if (ss.logs) {
        ss.logs['currentLogStep'] = 0;
      }
    });

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
  <DashboardHomeHeader />

  <div v-if="!appStore.loading" class="animate__animated animate__fadeIn animate__faster">
    <div class="container px-3">
      <div class="my-3 d-flex flex-column gap-3" style="margin-top: 0px !important">
        <div v-for="s in sessions" :key="`dashboard-home-videos-key-${s.id}`">
          <span v-if="s.logs">
            <!-- card -->
            <div class="card shadow-sm border">
              <!-- card header -->
              <div class="d-flex justify-content-between card-header">
                <!-- right -->
                <div>
                  <img
                    :src="
                      s.profile_picture_url ?? `https://dummyimage.com/200x200/bdbdbd/000000.jpg`
                    "
                    width="24"
                    height="24"
                    class="rounded-circle me-2"
                  />
                  <span role="button" @click="router.push('/dashboard/profile')">{{
                    s.username
                  }}</span>
                </div>

                <!-- right -->
                <div class="d-flex justify-content-between gap-3">
                  <!-- session name -->
                  <span role="button" @click="router.push(`/dashboard/sessions/${s.id}`)">{{
                    s.name
                  }}</span>

                  <!-- settings -->
                  <div class="dropdown">
                    <a
                      class="link-dark"
                      role="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      ><i class="bi bi-three-dots"></i
                    ></a>
                    <ul class="dropdown-menu dropdown-menu-end" style="min-width: fit-content">
                      <li><button class="dropdown-item btn-sm" type="button">Edit</button></li>
                      <li><button class="dropdown-item btn-sm" type="button">Share</button></li>
                      <li><button class="dropdown-item btn-sm" type="button">Delete</button></li>
                    </ul>
                  </div>
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
                      >
                        <source :src="log?.videos[0].video_url" type="video/mp4" />
                      </video>
                    </div>
                  </div>

                  <!-- dots -->
                  <div
                    v-if="s.logs?.length > 1"
                    class="d-flex gap-2 justify-content-center m-0 p-0"
                  >
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
                    <h5 class="card-title">{{ log.name }}</h5>
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
                        <small v-for="set in log.sets" :key="`key-set-${set.id}`">
                          1 set(s) x {{ set.reps }} rep(s) x {{ set.weight }}
                          {{ appStore.unitLabel }} @{{ set.rpe }}
                          rpe
                          {{ set.notes ? `- ${set.notes}` : '' }}
                        </small>
                      </span>
                    </p>
                  </div>

                  <div class="card-footer">
                    <small class="d-flex justify-content-between text-muted">
                      <!-- left -->
                      <span class="d-flex gap-3">
                        <!-- block -->
                        <span v-if="s.block_name">
                          <i class="bi bi-clipboard2-data me-1"></i>Block:
                          <span class="fw-light">{{ s.block_name }}</span>
                        </span>

                        <!-- date -->
                        <span><i class="bi bi-calendar-check me-1"></i> 2020-01-01</span>
                      </span>

                      <!-- right -->
                      <div class="d-flex gap-2">
                        <!-- session -->
                        <span
                          v-if="userStore.user.id === s.user_id"
                          role="button"
                          @click="router.push(`/dashboard/sessions/${s.id}`)"
                          ><i class="bi bi-journal-text me-1"> </i>
                          <span>
                            {{ s.id }}
                          </span>
                        </span>

                        <!-- comment -->
                        <span><i class="bi bi-chat me-1"></i><span>2</span></span>
                      </div>
                    </small>
                  </div>
                </span>
              </span>
            </div>
          </span>
        </div>
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
</style>
