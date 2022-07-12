<script setup>
// import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import DashboardFooter from '../components/dashboard/DashboardFooter.vue';
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
      <router-view> </router-view>
    </main>
    <DashboardFooter />
  </div>
</template>
