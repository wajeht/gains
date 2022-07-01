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
    <h1 class="mb-3">Signup</h1>

    <!-- username -->
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input
        v-model="username"
        type="username"
        class="form-control"
        id="username"
        :disabled="loading"
        required
      />
    </div>

    <!-- email -->
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input
        v-model="email"
        type="email"
        class="form-control"
        id="email"
        :disabled="loading"
        required
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
        :disabled="loading"
        required
      />
    </div>

    <!-- checkbox -->
    <div class="mb-4">
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          name="agree-checkbox"
          id="agree-checkbox"
          :disabled="loading"
          required
        /><label class="form-check-label" for="agree-checkbox"> I agree</label>
      </div>

      <!-- terms and privacy -->
      <div id="agree-text" class="form-text">
        Signing up signifies that you have read and agree to the
        <router-link to="/terms" class="link-dark">Terms of Service</router-link> and our
        <router-link to="/privacy" class="link-dark">Privacy Policy</router-link>.
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
        username: '',
        email: '',
        password: '',
        checkbox: '',
        loading: false,
      };
    },
    methods: {
      async handleSubmit() {
        this.loading = true;

        await sleep(3000);

        this.$router.push({ path: '/login' });
      },
    },
  };
</script>
