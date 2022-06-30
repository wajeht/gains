<template>
  <component :is="layout" />
</template>

<script >
  import DashboardLayout from './layouts/DashboardLayout.vue';
  import EmptyDashboardLayout from './layouts/EmptyDashboardLayout.vue';
  import RegularLayout from './layouts/RegularLayout.vue';

  export default {
    components: {
      DashboardLayout,
      RegularLayout,
      EmptyDashboardLayout,
    },
    data() {
      return {
        layout: null,
      };
    },
    watch: {
      $route(to) {
        // set layout by route meta
        if (to.meta.layout !== undefined) {
          this.layout = to.meta.layout;
        } else {
          this.layout = 'DashboardLayout'; // this is default layout if route meta is not set
        }
      },
    },
  };
</script>
