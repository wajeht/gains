<template>
  <component
    :is="layout"
    :class="{
      'dashboard-layout-style':
        layout === 'DashboardLayout' ||
        layout === 'EmptyDashboardLayout' ||
        layout === 'SingleDashboardLayout',
    }"
  />
</template>

<script setup>
import { watch, toRef } from 'vue';

// --- change theme
const appStore = useAppStore();
watch(toRef(appStore, 'darkMode'), () => {
  if (appStore.darkMode === true) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});
// --- change theme
</script>

<script>
import DashboardLayout from './layouts/DashboardLayout.vue';
import SingleDashboardLayout from './layouts/SingleDashboardLayout.vue';
import EmptyDashboardLayout from './layouts/EmptyDashboardLayout.vue';
import RegularLayout from './layouts/RegularLayout.vue';
import useAppStore from './store/app.store.js';

export default {
  components: {
    DashboardLayout,
    RegularLayout,
    EmptyDashboardLayout,
    SingleDashboardLayout,
  },
  data() {
    return {
      layout: null,
    };
  },
  watch: {
    $route(to) {
      if (
        to.meta.layout === 'DashboardLayout' ||
        to.meta.layout === 'EmptyDashboardLayout' ||
        to.meta.layout == 'SingleDashboardLayout'
      ) {
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

<style lang="scss">
@import '@/assets/styles/scss/custom.scss';
</style>

<style>
html {
  position: fixed;
  height: 100%;
  overflow: hidden;
}

body {
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

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

*:disabled {
  cursor: not-allowed !important;
  cursor: -moz-not-allowed !important;
  cursor: -webkit-not-allowed !important;
}
</style>
