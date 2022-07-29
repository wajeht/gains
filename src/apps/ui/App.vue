<template>
  <component :is="layout" />
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
      const userStore = useUserStore();
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
.btn-ripple {
  display: inline-block;
  position: relative;
  overflow: hidden;
  transition: all ease-in-out 0.5s;
}

.btn-ripple::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 25%;
  height: 100%;
  width: 50%;
  background-color: #000;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transition: all ease-in-out 0.5s;
  transform: scale(5, 5);
}

.btn-ripple:active::after {
  padding: 0;
  margin: 0;
  opacity: 0.2;
  transition: 0s;
  transform: scale(0, 0);
}
</style>
