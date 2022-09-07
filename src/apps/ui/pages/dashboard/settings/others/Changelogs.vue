<script setup>
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
import api from '../../../../../../utils/fetch-with-style.js';
import useAppStore from '../../../../store/app.store';
import { ref, onMounted } from 'vue';

const appStore = useAppStore();
const changelogs = ref('');

async function getChangelogs() {
  const res = await api.get(`/api/v1/variables/changelogs`);
  const json = await res.json();
  return json.changelogs;
}

onMounted(async () => {
  appStore.loading = true;
  const data = await getChangelogs();
  changelogs.value = data;
  appStore.loading = false;
});
</script>

<template>
  <!-- header -->
  <Backheader />

  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster"
  >
    <!-- loop -->
    <div class="my-3 d-flex flex-column gap-3">
      <div v-for="(cl, i) in changelogs" :key="i" class="card">
        <div class="card-body mt-0 pt-2">
          <!-- title -->
          <div class="d-flex justify-content-between gap-3 align-items-center">
            <!-- version -->
            <div v-html="cl.version"></div>

            <!-- collapsed/expend all cards -->
            <span
              @click="cl.current = !cl.current"
              class="p-0 m-0"
              style="background: none; border: none; box-shadow: none"
              role="button"
              v-auto-animate
            >
              <i v-if="!cl.current" class="bi bi-chevron-down"></i>
              <i v-if="cl.current" class="bi bi-chevron-up"></i>
            </span>
          </div>

          <!-- changelog -->
          <div v-if="cl.current" v-html="cl.changelog"></div>
        </div>
      </div>
    </div>
  </div>
</template>
