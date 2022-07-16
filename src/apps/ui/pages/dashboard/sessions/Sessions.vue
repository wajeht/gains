<script setup>
import SessionsHeader from '../../../components/dashboard/headers/SessionsHeader.vue';

import dayjs from 'dayjs';
import { onMounted, ref, reactive, onUpdated } from 'vue';
import { useRouter } from 'vue-router';

import { sleep } from '../../../../../utils/helpers.js';
import api from '../../../../../libs/fetch-with-style.js';

import useAppStore from '../../../store/app.store.js';
import useUserStore from '../../../store/user.store.js';

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();

const sessions = ref([]);

const alert = reactive({
  type: '',
  msg: '',
});

onMounted(async () => {
  try {
    appStore.loading = true;

    // await sleep(300);

    const res = await api.get(`/api/v1/sessions?user_id=${userStore.user.id}`);
    const json = await res.json();

    if (!res.ok) {
      appStore.loading = false;
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    sessions.value = json.data || [];

    appStore.loading = false;
  } catch (e) {
    appStore.loading = false;
    alert.type = 'danger';
    if (Array.isArray(e)) {
      alert.msg = e.map((cur) => cur.msg).join(' ');
      return;
    } else {
      alert.msg = e;
    }
  }
});

function logDetails(sid) {
  router.push({
    // path: `/dashboard/session/${id}`,
    name: 'SessionDetails',
    params: { sid: Number(sid) },
  });
}
</script>

<template>
  <SessionsHeader />
  <div v-if="appStore.loading === false" class="container px-3">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div
        v-if="alert.type"
        :class="`alert-${alert.type}`"
        class="mb-0 alert animate__animated animate__zoomIn animate__faster"
      >
        <span>{{ alert.msg }}</span>
      </div>

      <!-- sessions -->
      <div
        v-for="session in sessions"
        :key="`session-${session}`"
        data-aos="fade-up"
        data-aos-anchor-placement="top"
        class="card"
        :style="{
          'border-left': session.end_date === null ? '5px solid var(--bs-danger)' : '',
        }"
        id="log"
      >
        <div @click="logDetails(session.id)" class="card-body">
          <div class="d-flex justify-content-between gap-5">
            <!-- start -->
            <div>
              <span>{{ dayjs(session.created_at).format('MMM') }}</span>
              <h5 class="card-title">{{ dayjs(session.created).format('DD') }}</h5>
            </div>

            <!-- middle -->
            <div class="flex-grow-1">
              <h5 class="card-title">{{ session.name }}</h5>
              <div class="card-text">
                <ul class="list-unstyled mb-0 pb-0">
                  <li>close grip bench press</li>
                  <li>conventional deadlift</li>
                  <li>high bar squat</li>
                  <li>overhead shoulder press</li>
                </ul>
              </div>
            </div>

            <!-- end -->
            <div class="d-flex flex-column justify-content-between">
              <small class="text-muted d-block text-end">123 min</small>
              <small
                class="text-muted d-block text-end d-flex gap-1 fst-italic"
                style="font-size: 0.7rem"
              >
                <span class="text-danger">Incomplete!</span>
                <i class="bi bi-exclamation-triangle-fill text-danger"></i>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#log:hover {
  /* background: green; */
  background: #f4f4f4;
  cursor: pointer;
}
</style>
