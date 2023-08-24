<template>
  <!-- header -->
  <Backheader />

  <!-- contact -->
  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- contact -->
      <div class="card">
        <div class="card-body">
          <Terms />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Terms from '../../../../components/shared/Terms.vue';
import Backheader from '../../../../components/dashboard/headers/Backheader.vue';
export default {
  components: {
    Terms,
    Backheader,
  },
};
</script>
