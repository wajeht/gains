<script setup>
import SessionsHeader from '../../../components/dashboard/headers/SessionsHeader.vue';

import dayjs from 'dayjs';
import { onMounted, ref, reactive, onUpdated } from 'vue';
import { useRouter } from 'vue-router';

import { sleep } from '../../../../../utils/helpers.js';
import api from '../../../../../utils/fetch-with-style.js';

import useAppStore from '../../../store/app.store.js';
import useUserStore from '../../../store/user.store.js';

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // use plugin

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);

const sessions = ref([]);
const pagination = reactive({
  perPage: 20,
  currentPage: 0,
  details: null,
  lastPage: null,
});

const today = dayjs().format('YYYY/MM/DD');

const alert = reactive({
  type: '',
  msg: '',
});

onMounted(async () => {
  appStore.loading = true;
  await getUserSessions();
  pagination.lastPage = pagination.details?.lastPage;
  appStore.loading = false;
});

async function getUserSessions() {
  try {
    pagination.currentPage++;
    loading.value = true; // loading more button

    const res = await api.get(`/api/v1/sessions?user_id=${userStore.user.id}&perPage=${pagination.perPage}&currentPage=${pagination.currentPage}`); // prettier-ignore
    const json = await res.json();

    if (json.data?.length === 0) {
      appStore.loading = false;
      alert.type = 'warning';
      alert.msg =
        'There are no session with videos available available at this time! Please add a session via click the plus icon!';
      return;
    }

    if (!res.ok) {
      appStore.loading = false;
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }
    pagination.details = json.pagination;

    if (sessions.value.length === 0) {
      sessions.value = json.data || [];
    } else {
      loading.value = true; // loading more button
      json.data.forEach((element) => {
        sessions.value.push(element);
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

function calculateTotal(start, end) {
  if (!start || !end) return 0;
  const start_date = dayjs(start);
  const end_date = dayjs(end);
  const total = end_date.diff(start_date, 'minute');
  return total;
}

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
  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster"
  >
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="alert mb-0">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- sessions -->
      <div
        v-for="session in sessions"
        :key="`session-${session}`"
        class="card"
        :style="{
          // today
          'border-left':
            session.end_date === null && dayjs(session.start_date).format('YYYY/MM/DD') === today
              ? '5px solid var(--bs-warning) !important'
              : // yesterday
              session.end_date === null && dayjs(session.start_date).format('YYYY/MM/DD') < today
              ? '5px solid var(--bs-danger) !important'
              : '',
        }"
        id="log"
        v-auto-animate
      >
        <div @click="logDetails(session.id)" class="card-body">
          <div class="d-flex justify-content-between gap-5">
            <!-- start -->
            <div class="d-flex flex-column justify-content-between align-items-center">
              <!-- date -->
              <div>
                <span>{{ dayjs(session.start_date).format('MMM') }}</span>
                <h5 class="card-title">{{ dayjs(session.start_date).format('DD') }}</h5>
              </div>

              <!-- block and progress -->
              <span class="d-flex flex-column gap-1">
                <!-- incomplete or progress -->
                <small v-if="session.end_date === null" style="font-size: 0.7rem">
                  <!-- danger -->
                  <!-- prettier-ignore -->
                  <span v-if="session.end_date === null && dayjs(session.start_date).format('YYYY/MM/DD') === today"
                  class="text-warning">
                  <font-awesome-icon icon="fa-refresh" />
                </span>

                  <!-- danger -->
                  <!-- prettier-ignore -->
                  <span v-if="session.end_date === null && dayjs(session.start_date).format('YYYY/MM/DD') < today"
                  class="text-danger">
                  <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                </span>
                </small>

                <!-- block -->
                <small v-if="session.block_id" class="text-muted" style="font-size: 0.7rem">
                  <i class="bi bi-bricks"></i>
                </small>
              </span>
            </div>

            <!-- middle -->
            <div class="flex-grow-1">
              <h5 class="card-title">{{ session.name }}</h5>
              <div class="card-text">
                <small>
                  <ul class="list-unstyled mb-0 pb-0 list-group-numbered">
                    <li v-for="log in session.json" :key="`key-${log.id}`">{{ log.name }}</li>
                  </ul>
                </small>
              </div>
            </div>

            <!-- end -->
            <div class="d-flex flex-column justify-content-between">
              <small class="text-muted d-block text-end">{{
                session.end_date === null
                  ? '?'
                  : dayjs(session.end_date).from(session.start_date, true)
              }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- load more -->
      <button
        v-if="pagination.details?.currentPage !== pagination.lastPage && sessions.length"
        @click="getUserSessions()"
        type="button"
        class="btn btn-dark"
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
</template>

<style>
#log:hover {
  /* background: green; */
  background: #f4f4f4;
  cursor: pointer;
}
</style>
