<script setup>
// import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import DashboardFooter from '../components/dashboard/DashboardFooter.vue';
import Toast from '../components/dashboard/Toast.vue';
import Loading from '../components/dashboard/Loading.vue';
import useAppStore from '../store/app.store.js';

const appStore = useAppStore();
</script>

<template>
  <div id="admin" class="d-flex flex-column min-vh-100 border-2 bg-black">
    <!-- <DashboardHeader /> -->
    <main
      id="admin-router-wrapper"
      class="container px-0 flex-grow-1"
      style="background-color: #ebeae2"
    >
      <Loading v-if="appStore.loading" />

      <!-- toast -->
      <Toast v-if="appStore.toast.toggle" :message="appStore.toast.message" />

      <router-view> </router-view>
    </main>
    <DashboardFooter />
  </div>
</template>
