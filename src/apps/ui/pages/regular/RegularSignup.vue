<template>
  <div
    class="
      px-4
      col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4
      mx-auto
      animate__animated animate__fadeIn
    "
  >
    <Signup />
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
