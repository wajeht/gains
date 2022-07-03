<template>
  <!-- go back -->
  <button @click="$router.back()" class="btn btn-outline-dark mb-3">
    <i class="bi bi-arrow-left"></i> Back
  </button>

  <!-- contact -->
  <div class="card">
    <div class="card-body">
      <Contact />
    </div>
  </div>
</template>

<script>
  import Contact from '../../components/shared/Contact.vue';

  export default {
    components: {
      Contact,
    },
  };
</script>
