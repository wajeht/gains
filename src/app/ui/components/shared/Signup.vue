<template>
  <!-- alert -->
  <div
    v-if="alert.type"
    :class="`alert-${alert.type}`"
    class="mb-3 alert animate__animated animate__zoomIn animate__faster"
  >
    <span>{{ alert.msg }}</span>
  </div>

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
      <div class="input-group">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          class="form-control"
          id="password"
          autocomplete="on"
          required
          :disabled="loading"
        />
        <button
          v-if="password.length"
          @click="showPassword = !showPassword"
          class="btn btn-outline-dark"
          type="button"
          id="show-hide-password-button"
          :disabled="loading || !password"
        >
          <i v-if="showPassword" class="bi bi-eye-slash"></i>
          <i v-else class="bi bi-eye"></i>
        </button>
      </div>
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
        <router-link
          class="p-0 m-0 link-dark"
          style="text-decoration: underline"
          :class="{ disabled: loading === true }"
          to="/terms"
          >Terms of Service</router-link
        >
        and our
        <router-link
          class="link-dark p-0 m-0"
          style="text-decoration: underline"
          :class="{ disabled: loading === true }"
          to="/privacy"
          >Privacy Policy</router-link
        >.
      </div>
    </div>

    <!-- button -->
    <button
      type="submit"
      class="btn btn-dark w-100"
      :disabled="loading || !email || !username || !password"
    >
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
    <!-- <a
      :class="{ disabled: loading === true }"
      class="btn w-100 text-light"
      href="#"
      style="background: #7289da"
      title="Not supported yet!"
      ><i class="bi bi-discord me-1"></i>Login with Discord</a
    >

    <a
      :class="{ disabled: loading === true }"
      class="btn btn-success w-100"
      style="border: 1px solid #ced4da"
      href="#"
      title="Not supported yet!"
      ><i class="bi bi-github me-1"></i>Login with Github</a
    > -->

    <!-- email -->
    <router-link
      :class="{ disabled: loading === true }"
      :to="loginLink"
      class="btn btn-light w-100"
      style="border: 1px solid #ced4da"
      href="#"
      ><i class="bi bi-envelope me-1"></i>Login with Email</router-link
    >
  </div>
</template>

<script>
import { sleep, isMobile } from '../../../../utils/helpers.js';
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
      showPassword: false,
      loading: false,
      loginLink: '/login',
      alert: {
        type: '',
        msg: '',
      },
    };
  },
  mounted() {
    if (isMobile()) this.loginLink = '/dashboard/login';
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
          }),
        });

        const json = await res.json();
        if (res.status >= 500) {
          throw new Error(
            'The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again later!',
          );
        }
        if (!res.ok) {
          this.loading = false;
          throw json.errors;
        }

        this.loading = false;

        this.alert.type = 'success';
        this.alert.msg = `You're almost there! We sent an email to ${this.email} in Just click on the link in that email to complete your signup. If you don't see it, you may need to check your spam folder.`; // prettier-ignore

        this.username = '';
        this.email = '';
        this.password = '';

        // clear alert success after few sec
        await sleep(20000);

        this.alert.type = '';
        this.alert.msg = '';
      } catch (e) {
        this.alert.type = 'danger';
        this.alert.msg = e.map((cur) => cur.msg).join(' ');
      }
    },
  },
};
</script>
