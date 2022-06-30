<template>
  <form @submit.prevent="handleSubmit" class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
    <h1 class="mb-3">Login</h1>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input v-model="email" type="email" class="form-control" id="email" required />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input v-model="password" type="password" class="form-control" id="password" required />
    </div>
    <div class="mb-3 form-check">
      <input type="checkbox" class="form-check-input" id="checkbox" />
      <div class="d-flex justify-content-between">
        <label class="form-check-label" for="checkbox-label">Remember me</label>
        <router-link class="text-decoration-none link-dark" to="/forget-password"
          >Forget password?</router-link
        >
      </div>
    </div>
    <button type="submit" class="btn btn-dark">Submit</button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      handleSubmit() {
        this.$router.push({ path: '/dashboard/profile' });
      },
    },
  };
</script>
