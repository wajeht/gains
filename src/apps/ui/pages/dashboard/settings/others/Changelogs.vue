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
    <div class="my-3 d-flex flex-column gap-3">
      <div class="card">
        <div class="card-body">
          <div v-html="changelogs"></div>
        </div>
      </div>
    </div>
  </div>
</template>
