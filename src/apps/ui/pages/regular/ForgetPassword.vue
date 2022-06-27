<template>
  <form @submit.prevent="handleSubmit" class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
    <h1 class="mb-3">Forget Password</h1>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input v-model="email" type="email" class="form-control" id="email" required />
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
      };
    },
    methods: {
      handleSubmit() {
        this.$router.push({ path: '/login' });
      },
    },
  };
</script>
