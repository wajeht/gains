<template>
  <!-- form -->
  <form @submit.prevent="handleSubmit">
    <!-- title -->
    <h1 class="mb-3">Login</h1>

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
  </form>

  <!-- or -->
  <Or />

  <!-- o-auth -->
  <div class="d-flex flex-column gap-2 mb-3">
    <!-- discord -->
    <a
      class="btn w-100 text-light"
      href="#"
      style="background: #7289da"
      v-tooltip
      title="Not supported yet!"
      ><i class="bi bi-discord me-1"></i>Login with Discord</a
    >

    <!-- github -->
    <a
      class="btn btn-success w-100"
      style="border: 1px solid #ced4da"
      href="#"
      v-tooltip
      title="Not supported yet!"
      ><i class="bi bi-github me-1"></i>Login with Github</a
    >

    <!-- email -->
    <router-link
      to="/dashboard/signup"
      class="btn btn-light w-100"
      style="border: 1px solid #ced4da"
      href="#"
      ><i class="bi bi-envelope me-1"></i>Signup with Email</router-link
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
