<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Backheader from '../../components/dashboard/headers/Backheader.vue';

const router = useRouter();
const route = useRoute();

function goBack() {
  if (route.query.back == null || route.query.back == undefined || route.query.back == 'null') {
    return window.history.go(-3);
  } else {
    router.push(route.query.back);
  }
}
</script>

<template>
  <!-- header -->
  <Backheader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Unauthorized</h4>
          <p class="card-text">You do not have proper permission to view this page.</p>

          <button @click="goBack()" class="btn btn-dark" type="button">Go back</button>
        </div>
      </div>
    </div>
  </div>
</template>
