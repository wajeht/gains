<script setup>
import { computed } from 'vue';
import Backheader from '../../components/dashboard/headers/Backheader.vue';

const isDev = computed(() => import.meta.env.MODE === 'development');
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Error</h4>
          <p v-if="isDev" class="card-text">Not implemented yet!</p>
          <p v-else class="card-text">Something went wrong!</p>
        </div>
      </div>
    </div>
  </div>
</template>
