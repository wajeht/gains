<template>
  <!-- card -->
  <div class="container px-1">
    <div class="card">
      <div class="card-body">
        <Signup />
      </div>
    </div>
  </div>
</template>

<script>
import Signup from '../../components/shared/Signup.vue';

export default {
  components: {
    Signup,
  },
};
</script>
