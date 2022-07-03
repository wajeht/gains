<template>
  <div class="mb-3 text-center">
    <img class="img-fluid w-25 mb-1" src="../../assets/images/logo.png" />
    <p>The best way to track your lift</p>
  </div>

  <!-- form -->
  <form @submit.prevent="handleSubmit" class="card">
    <div class="card-body">
      <!-- error -->
      <div
        v-if="error.length"
        :class="{ 'animate__animated animate__headShake': error.length }"
        class="mb-3 alert alert-danger"
      >
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
      <button type="submit" class="btn btn-dark w-100" :disabled="loading">
        <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>

        <span v-if="!loading"> Submit </span>
        <span v-if="loading"> Loading... </span>
      </button>
    </div>
    <!-- footer -->
    <div class="card-footer d-flex justify-content-between">
      <span>Don't have an account?</span>
      <router-link to="/dashboard/signup" class="link-dark text-decoration-none"
        >Sign up here!</router-link
      >
    </div>
  </form>
</template>

<script>
  import { sleep } from '../../../../utils/helpers.js';

  export default {
    data() {
      return {
        email: 'test@test.com',
        password: 'test',
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
