<script setup>
import api from '../../../../utils/fetch-with-style.js';
import useAppStore from '../../store/app.store.js';
import dayjs from 'dayjs';

import { onMounted, ref, reactive } from 'vue';

const activities = ref([]);
const appStore = useAppStore();
const alert = reactive({ type: '', msg: '' });

onMounted(async () => {
  let fa = await fetchActivities();
  fa.pop();
  activities.value = fa
    .map((a) => JSON.parse(a))
    .map((a) => {
      return {
        level: a.level,
        time: a.time,
        msg: a.msg,
      };
    });
});

async function fetchActivities() {
  try {
    const res = await api.get(`/api/admin/view-logs?latest=-25`);
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
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Activities</h5>
      <h6 class="card-subtitle mb-2 text-muted">Latest 50 logs</h6>

      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- table -->
      <small v-else>
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
              <td>{{ a.level }}</td>
              <td>{{ dayjs(a.time).format('YYYY/DD/MM hh:MM:ss a') }}</td>
              <td>{{ a.msg }}</td>
            </tr>
          </tbody>
        </table>
      </small>
    </div>
  </div>
</template>
