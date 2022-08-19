<template>
  <component
    :is="layout"
    :class="{
      'dashboard-layout-style': layout === 'DashboardLayout' || layout === 'EmptyDashboardLayout',
    }"
  />
</template>

<script>
import DashboardLayout from './layouts/DashboardLayout.vue';
import EmptyDashboardLayout from './layouts/EmptyDashboardLayout.vue';
import RegularLayout from './layouts/RegularLayout.vue';
import useUserStore from './store/user.store.js';

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
      if (to.meta.layout === 'DashboardLayout' || to.meta.layout === 'EmptyDashboardLayout') {
        document.body.style.backgroundColor = 'black';
      } else {
        document.body.style.backgroundColor = '';
      }

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

<style>
.btn-group-xs > .btn,
.btn-xs {
  padding: 0.25rem 0.4rem;
  font-size: 0.875rem;
  line-height: 0.5;
  border-radius: 0.2rem;
}

.dashboard-layout-style {
  max-width: 540px;
  margin: 0 auto;
  background-color: black !important;
}

.btn-xs {
  padding: 1px 5px !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  border-radius: 3px !important;
}
</style>
