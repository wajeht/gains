<template>
  <div class="container px-1">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- go back -->
      <a class="link-secondary text-decoration-none" @click="$router.back()" role="button"
        ><i class="bi bi-arrow-left"></i> Back</a
      >

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
