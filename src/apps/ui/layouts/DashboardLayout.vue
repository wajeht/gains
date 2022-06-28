<template>
  <div id="admin" class="d-flex flex-column min-vh-100 border-2 bg-black">
    <DashboardHeader />
    <main id="admin-router-wrapper" class="container flex-grow-1 bg-white">
      <router-view />
    </main>
    <DashboardFooter />
  </div>
</template>

<script>
  import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
  import DashboardFooter from '../components/dashboard/DashboardFooter.vue';

  export default {
    components: {
      DashboardHeader,
      DashboardFooter,
    },
  };
</script>
