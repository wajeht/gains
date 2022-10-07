<script setup>
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';

import { onMounted, ref, reactive } from 'vue';
import useAppStore from '../../../../store/app.store.js';
import api from '../../../../../../utils/fetch-with-style.js';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // use plugin

const appStore = useAppStore();
const issues = ref([]);
const alert = reactive({
  type: '',
  msg: '',
});

onMounted(async () => {
  const i = await fetchIssues();
  issues.value = i || [];
});

async function fetchIssues() {
  try {
    appStore.loading = true;

    const res = await api.get(`/api/admin/issues`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    appStore.loading = false;
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
  <!-- header -->
  <Backheader />

  <!-- contact -->
  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="alert">
        <span>{{ alert.msg }}</span>
      </div>

      <div class="list-group">
        <a
          v-for="i in issues"
          :key="`issue-key-${i.id}`"
          :href="i.html_url"
          target="_blank"
          class="list-group-item list-group-item-action d-flex gap-3 py-3"
        >
          <div class="d-flex gap-2 w-100 justify-content-between">
            <div>
              <div class="d-flex gap-1">
                <!-- title -->
                <h6 class="mb-0">
                  {{ i.title }}
                </h6>

                <!-- label -->
                <div class="d-flex flex-row gap-2">
                  <small
                    v-for="l in i?.labels"
                    :key="`issue-label-key-${i.labels.id}`"
                    :style="{ 'background-color': `#${l.color} !important` }"
                    style="padding-bottom: 1px"
                    class="rounded px-1"
                  >
                    {{ l.name }}
                  </small>
                </div>
              </div>

              <p class="mb-0 opacity-75">
                #{{ i.number }} {{ i.state }} {{ dayjs().from(i.created_at, true) }} by
                {{ i.user.login }}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
