<template>
  <form @submit.prevent="handleSubmit">
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
    <button type="submit" class="btn btn-dark w-100" :disabled="loading">
      <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>

      <span v-if="!loading"> Submit </span>
      <span v-if="loading"> Loading... </span>
    </button>
  </form>

  <!-- or -->
  <Or />

  <!-- o-auth -->
  <div class="d-flex flex-column gap-2 mb-3">
    <!-- discord -->
    <a class="btn w-100 text-light" href="#" style="background: #7289da"
      ><i class="bi bi-discord me-1"></i>Login with Discord</a
    >

    <!-- github -->
    <a class="btn btn-success w-100" style="border: 1px solid #ced4da" href="#"
      ><i class="bi bi-github me-1"></i>Login with Github</a
    >

    <!-- email -->
    <router-link
      to="/dashboard/login"
      class="btn btn-light w-100"
      style="border: 1px solid #ced4da"
      href="#"
      ><i class="bi bi-envelope me-1"></i>Login with Email</router-link
    >
  </div>
</template>

<script>
  import { sleep } from '../../../../utils/helpers.js';
  import Or from './Or.vue';

  export default {
    components: {
      Or,
    },
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
