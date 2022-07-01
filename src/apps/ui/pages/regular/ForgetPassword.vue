<template>
  <div
    class="
      px-4
      col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4
      mx-auto
      animate__animated animate__fadeIn
    "
  >
    <!-- form -->
    <form @submit.prevent="handleSubmit">
      <!-- title -->
      <h1 class="mb-3">Forget Password</h1>

      <!-- error -->
      <div
        v-if="alert.length"
        class="mb-3 alert alert-success animate__animated animate__zoomIn animate__faster"
      >
        <span>{{ alert }}</span>
      </div>

      <!-- email -->
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          :disabled="loading"
          required
        />
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
  </div>
</template>

<script>
  import { sleep } from '../../../../utils/helpers.js';

  export default {
    data() {
      return {
        email: '',
        loading: false,
        alert: '',
      };
    },
    methods: {
      async handleSubmit() {
        this.loading = true;

        await sleep(3000);

        this.loading = false;

        this.email = '';
        this.alert = "If you have an account with us, we'll send you a reset link to your inbox!";

        await sleep(5000);

        this.alert = '';
      },
    },
  };
</script>
