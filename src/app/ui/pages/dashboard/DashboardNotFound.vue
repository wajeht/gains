<script setup>
import Backheader from '../../components/dashboard/headers/Backheader.vue';
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">404</h4>
          <p class="card-text">Dashboard not found!</p>
        </div>
      </div>
    </div>
  </div>
</template>
