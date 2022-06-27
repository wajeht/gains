<template>
  <form @submit.prevent="handleSubmit" class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
    <h1 class="mb-3">Signup</h1>
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input v-model="username" type="username" class="form-control" id="username" required />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input v-model="email" type="email" class="form-control" id="email" required />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input v-model="password" type="password" class="form-control" id="password" required />
    </div>
    <div class="mb-4">
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          name="agree-checkbox"
          id="agree-checkbox"
          required=""
        /><label class="form-check-label" for="agree-checkbox"> I agree</label>
      </div>
      <div id="agree-text" class="form-text">
        Signing up signifies that you have read and agree to the
        <router-link to="/terms" class="">Terms of Service</router-link> and our
        <router-link to="/privacy" class="">Privacy Policy</router-link>.
      </div>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
      };
    },
    methods: {
      handleSubmit() {
        this.$router.push({ path: '/login' });
      },
    },
  };
</script>
