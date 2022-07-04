<template>
  <!-- header -->
  <Backheader />

  <!-- contact -->
  <div class="container px-3">
    <div class="my-3 d-flex flex-column gap-3">
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
  import Backheader from '../../components/dashboard/headers/Backheader.vue';

  export default {
    components: {
      Contact,
      Backheader,
    },
  };
</script>
