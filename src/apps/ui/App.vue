<template>
  <component :is="layout" />
</template>

<script setup>
  import { computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  import RegularLayout from './layouts/RegularLayout.vue';
  import DashboardLayout from './layouts/DashboardLayout.vue';

  const router = useRouter();
  const route = useRoute();

  const layouts = {
    RegularLayout: RegularLayout,
    DashboardLayout: DashboardLayout,
  };

  const defaultLayout = 'RegularLayout';
  const layout = computed(() => layouts[route.meta.layout || defaultLayout]);
</script>
