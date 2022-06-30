<template>
  <div id="regular" class="d-flex flex-column min-vh-100">
    <RegularHeader />
    <div class="flex-fill container">
      <router-view />
    </div>
    <RegularFooter />
  </div>
</template>

<script>
  import RegularHeader from '../components/regular/RegularHeader.vue';
  import RegularFooter from '../components/regular/RegularFooter.vue';
  export default {
    components: {
      RegularHeader,
      RegularFooter,
    },
  };
</script>
