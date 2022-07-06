<template>
  <!-- header -->
  <Backheader />

  <!-- contact -->
  <div class="container px-3">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- contact -->
      <div class="card">
        <div class="card-body">
          <Privacy />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Privacy from '../../../../components/shared/Privacy.vue';
  import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
  export default {
    components: {
      Privacy,
      Backheader,
    },
  };
</script>
