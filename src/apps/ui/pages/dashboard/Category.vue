<script setup>
import Backheader from '../../components/dashboard/headers/Backheader.vue';
import api from '../../../../utils/fetch-with-style.js';
import useAppStore from '../../store/app.store.js';

import { ref, onMounted, reactive } from 'vue';

const props = defineProps({
  category_id: Number,
});

const alert = reactive({
  type: '',
  msg: '',
});

const categories = ref([]);

const appStore = useAppStore();

onMounted(async () => {
  appStore.loading = true;
  const c = await getUserExerciseByCategoryId();
  categories.value = c || [];
  appStore.loading = false;
});

async function getUserExerciseByCategoryId() {
  try {
    const res = await api.get(`/api/v1/exercises?exercise_category_id=${props.category_id}`);
    const json = await res.json();

    if (!res.ok) {
      if (json.errors) {
        throw json.errors;
      } else {
        throw json.message;
      }
    }

    if (json.data.length === 0) {
      throw new Error('There are no exercises available for this category!');
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
  <!-- header -->
  <Backheader />

  <div
    v-if="!appStore.loading"
    class="container px-3 animate__animated animate__fadeIn animate__faster"
  >
    <div class="my-3 d-flex flex-column gap-3">
      <!-- alert -->
      <div v-if="alert.type" :class="`alert-${alert.type}`" class="mb-0 alert">
        <span>{{ alert.msg }}</span>
      </div>

      <!-- categories -->
      <div class="list-group">
        <router-link
          v-for="(category, i) in categories"
          :to="`/dashboard/exercises/${category.id}`"
          class="list-group-item list-group-item-action d-flex justify-content-between py-3"
        >
          <!-- left -->
          <h6 class="mb-0">{{ category.name }}</h6>

          <!-- right -->
          <!-- <small class="opacity-50 inline-block">x</small> -->
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
