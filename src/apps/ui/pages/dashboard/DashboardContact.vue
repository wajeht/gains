<template>
  <div class="container">
    <div class="flex my-3 gap-2">
      <!-- go back -->
      <div class="mb-3">
        <span @click="$router.back()" role="button"><i class="bi bi-arrow-left"></i> Back</span>
      </div>

      <!-- contact -->
      <div class="card">
        <div class="card-body">
          <Contact />
        </div>
      </div>
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
