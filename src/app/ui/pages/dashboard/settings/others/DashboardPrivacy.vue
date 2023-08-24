<script setup>
import Privacy from '../../../../components/shared/Privacy.vue';
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
</script>

<template>
  <!-- header -->
  <Backheader />

  <!-- contact -->
  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- contact -->
      <div class="card">
        <div class="card-body">
          <Privacy />
        </div>
      </div>
    </div>
  </div>
</template>
