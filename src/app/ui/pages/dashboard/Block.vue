<script setup>
import Backheader from '../../components/dashboard/headers/Backheader.vue';

import { ref } from 'vue';

const props = defineProps({
  block_id: Number,
});
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">TODO</h5>
          <p class="card-text">implement block page</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
