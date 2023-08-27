<script setup>
import api from '../../../../utils/fetch-with-style.js';
import useAppStore from '../../store/app.store.js';
import dayjs from 'dayjs';

import { onMounted, ref, reactive } from 'vue';

const activities = ref([]);
const appStore = useAppStore();
const alert = reactive({ type: '', msg: '' });
const collapsed = ref(false);
const loading = ref(false);

const AMOUNT = ref(25);

onMounted(async () => {
  collapsed.value = true;
  await fetchActivities();
});

async function fetchActivities() {
  try {
    const res = await api.get(`/api/admin/view-logs?latest=-${AMOUNT.value}`);
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

    // last item is like "''", so we gotta pop it or json parse will failed
    if (json.data.length > 2) json.data.pop();
    activities.value = json.data
      .map((a) => JSON.parse(a))
      .map((a) => {
        return {
          level: a.level,
          time: a.time,
          msg: a.msg,
        };
      });
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
}

async function refetch() {
  loading.value = true;

  await fetchActivities();

  loading.value = false;
}
</script>

<template>
  <div class="card">
    <div class="card-body" v-auto-animate>
      <!-- title -->
      <div class="d-flex justify-content-between mb-2">
        <!-- left -->
        <div class="d-flex gap-3">
          <!-- title -->
          <h5 class="card-title mb-0">
            <span>Activities</span>
            <small class="text-muted"> - view activities of gains</small>
          </h5>
        </div>

        <!-- right -->
        <div class="d-flex gap-3">
          <!-- refresh -->
          <span v-if="collapsed" role="button" @click="refetch()">
            <!-- arrow -->
            <i v-if="!loading" class="bi bi-arrow-repeat"></i>

            <!-- spinner -->
            <div v-if="loading" class="spinner-border spinner-border-sm text-muted" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </span>

          <!-- show/hide -->
          <span role="button" @click="collapsed = !collapsed">
            <i v-if="!collapsed" class="bi bi-chevron-down"></i>
            <i v-else class="bi bi-chevron-up"></i>
          </span>
        </div>
      </div>

      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- table -->
      <div
        v-else
        v-if="collapsed"
        style="overflow-y: scroll !important"
        :style="{ 'max-height': `${30 * activities.length}px !important` }"
      >
        <small>
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">level</th>
                <th scope="col">time</th>
                <th scope="col">message</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, index) in activities" :key="`activities-key-$${index}`">
                <td>
                  <small
                    :class="{
                      'bg-info text-black px-1 rounded': a.level === 'info',
                      'bg-warning text-black px-1 rounded': a.level === 'warn',
                      'bg-danger text-white px-1 rounded': a.level === 'error',
                    }"
                  >
                    {{ a.level }}
                  </small>
                </td>
                <td>{{ dayjs(a.time).format('YYYY/DD/MM hh:MM:ss a') }}</td>
                <td>{{ a.msg }}</td>
              </tr>
            </tbody>
          </table>
        </small>
      </div>
    </div>
  </div>
</template>
