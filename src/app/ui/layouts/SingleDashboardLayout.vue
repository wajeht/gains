<script setup>
import Toast from '../components/dashboard/Toast.vue';
import Loading from '../components/dashboard/Loading.vue';
import useAppStore from '../store/app.store.js';

const appStore = useAppStore();
</script>

<template>
  <div id="dashboard" class="d-flex flex-column min-vh-100 border-2 bg-black">
    <main
      id="admin-router-wrapper"
      class="container px-0 flex-grow-1"
      style="background-color: #ebeae2"
    >
      <Loading v-if="appStore.loading" style="max-width: 540px" />

      <!-- toast -->
      <Toast v-if="appStore.toast.toggle && !appStore.loading" :message="appStore.toast.message" />

      <router-view> </router-view>
    </main>
  </div>
</template>
