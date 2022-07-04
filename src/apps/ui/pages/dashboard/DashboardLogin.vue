<template>
  <!-- card -->
  <div class="container px-1">
    <div class="card">
      <div class="card-body">
        <Login />
      </div>
    </div>
  </div>
</template>

<script>
  import Login from '../../components/shared/Login.vue';

  export default {
    components: {
      Login,
    },
  };
</script>
