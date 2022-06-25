<template>
  <div id="admin">
    <DashboardHeader />
    <div id="admin-router-wrapper" class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
  import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
  export default {
    components: {
      DashboardHeader,
    },
  };
</script>
