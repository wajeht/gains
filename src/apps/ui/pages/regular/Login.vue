<template>
  <form
    @submit.prevent="handleSubmit"
    class="
      px-4
      col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4
      mx-auto
      animate__animated animate__fadeIn
    "
  >
    <!-- title -->
    <h1 class="mb-3">Login</h1>

    <!-- error -->
    <div v-if="error.length" class="mb-3 alert alert-danger">
      <span>{{ error }}</span>
    </div>

    <!-- email -->
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input
        v-model="email"
        type="email"
        class="form-control"
        id="email"
        placeholder="test@test.com"
        required
        :disabled="loading"
      />
    </div>

    <!-- password -->
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        v-model="password"
        type="password"
        class="form-control"
        id="password"
        placeholder="test"
        required
        :disabled="loading"
      />
    </div>

    <!-- checkbox -->
    <div class="mb-3 form-check">
      <input type="checkbox" class="form-check-input" id="checkbox" :disabled="loading" />
      <div class="d-flex justify-content-between">
        <label class="form-check-label" for="checkbox-label">Remember me</label>
        <router-link class="text-decoration-none link-dark" to="/forget-password"
          >Forget password?</router-link
        >
      </div>
    </div>

    <!-- button -->
    <button type="submit" class="btn btn-dark" :disabled="loading">
      <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>

      <span v-if="!loading"> Submit </span>
      <span v-if="loading"> Loading... </span>
    </button>
  </form>
</template>

<script>
  import { sleep } from '../../../../utils/helpers.js';

  export default {
    data() {
      return {
        email: '',
        password: '',
        error: '',
        loading: false,
      };
    },
    methods: {
      async handleSubmit() {
        this.loading = true;

        await sleep(3000);

        if (this.email != 'test@test.com' && this.password != 'test') {
          this.error = 'Invalid email or password!';
          this.loading = false;
          return;
        }

        this.$router.push({ path: '/dashboard/profile' });
      },
    },
  };
</script>
