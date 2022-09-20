<script>
import Or from './Or.vue';
import useUserStore from '../../store/user.store.js';
import userAppStore from '../../store/app.store.js';
import { isMobile } from '../../../../utils/helpers.js';
import useAppStore from '../../store/app.store.js';

export default {
  components: {
    Or,
  },
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      remember_me: false,
      loading: false,
      reVerifyMessage: false,
      signupLink: '/signup',
      alert: {
        type: '',
        msg: '',
      },
    };
  },
  mounted() {
    if (isMobile()) this.signupLink = '/dashboard/signup';
  },
  methods: {
    async reSendVerificationEmail() {
      try {
        this.alert.type = '';
        this.alert.type = '';
        this.loading = true;

        const res = await fetch(`/api/auth/reverify?email=${this.email}`);
        const json = await res.json();

        if (!res.ok) {
          this.loading = false;
          throw json.errors;
        }

        this.reVerifyMessage = false;
        this.loading = false;
        this.alert.type = 'success';
        this.alert.msg = 'We have sent a new re-verification link to your email!';
        this.email = '';
        this.password = '';
      } catch (e) {
        this.alert.type = 'danger';
        this.alert.msg = e.map((cur) => cur.msg).join(' ');
      }
    },
    async handleSubmit() {
      try {
        this.loading = true;
        const userStore = useUserStore();
        const appStore = useAppStore();

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            remember_me: this.remember_me,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          this.loading = false;
          if (json.errors) {
            throw json.errors;
          } else {
            throw json.message;
          }
        }

        const [user] = json.data;

        appStore.appVersion = json.appVersion;
        userStore.isLoggedIn = true;
        userStore.setUserInfo(
          user.id,
          user.username,
          user.email,
          user.first_name,
          user.last_name,
          user.weight,
          user.profile_picture_url,
        );

        this.$router.push({ path: '/dashboard/profile' });
      } catch (e) {
        this.loading = false;
        this.alert.type = 'danger';

        if (Array.isArray(e)) {
          this.alert.msg = e.map((cur) => cur.msg).join(' ');
          return;
        }

        this.alert.msg = e;

        const connectionErrorString =
          `select * from "users" where "email" = $1 - Connection terminated unexpectedly select * from "users" where "email" = $1 Connection terminated unexpectedly`.split(
            ' ',
          );
        if (this.alert.msg.includes(...connectionErrorString)) {
          this.alert.msg = 'Woops! I just woke the database up. Please Login again!';
          return;
        }

        // resent verification email
        if (this.alert.msg.includes('verification')) {
          this.reVerifyMessage = true;
          this.password = '';
        }
      }
    },
  },
};
</script>

<template>
  <!-- form -->
  <form @submit.prevent="handleSubmit" autocomplete="on">
    <!-- title -->
    <h1 class="mb-3">Login</h1>

    <!-- alert -->
    <div
      v-if="alert.type"
      :class="`alert-${alert.type}`"
      class="mb-3 alert animate__animated animate__zoomIn animate__faster"
    >
      <span>{{ alert.msg }}</span>
      <span v-if="reVerifyMessage">
        If you have lost the reverification email,
        <a class="link-danger" style="cursor: pointer" @click="reSendVerificationEmail()"
          >click here</a
        >
        to get a new reverification email!
      </span>
    </div>

    <!-- email -->
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input
        v-model="email"
        type="email"
        class="form-control"
        id="email"
        autocomplete="on"
        required
        :disabled="loading"
      />
    </div>

    <!-- password -->
    <div class="mb-3">
      <div class="d-flex gap-2">
        <label for="password" class="form-label me-2">Password</label>
        <div role="button" @click="showPassword = !showPassword" style="cursor: pointer">
          <i v-if="showPassword" class="bi bi-eye-slash"></i>
          <i v-else class="bi bi-eye"></i>
        </div>
      </div>
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        class="form-control"
        id="password"
        autocomplete="on"
        required
        :disabled="loading"
      />
    </div>

    <!-- checkbox -->
    <div class="mb-3 form-check">
      <input
        v-model="remember_me"
        type="checkbox"
        class="form-check-input"
        id="remember-me"
        :disabled="loading"
      />
      <div class="d-flex justify-content-between">
        <!-- checkbox -->
        <label class="form-check-label" for="remember-me">Remember me</label>

        <!-- forget-password -->
        <a
          href="#"
          :class="{ disabled: loading === true }"
          class="btn p-0 m-0 text-dark"
          @click="$router.push('/forget-password')"
        >
          Forget password?
        </a>
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
    <!-- <a
      :class="{ disabled: loading === true }"
      class="btn w-100 text-light"
      href="#"
      style="background: #7289da"
      v-tooltip
      title="Not supported yet!"
      ><i class="bi bi-discord me-1"></i>Login with Discord</a
    >

    <a
      :class="{ disabled: loading === true }"
      class="btn btn-success w-100"
      style="border: 1px solid #ced4da"
      href="#"
      v-tooltip
      title="Not supported yet!"
      ><i class="bi bi-github me-1"></i>Login with Github</a
    > -->

    <!-- email -->
    <router-link
      :to="signupLink"
      :class="{ disabled: loading === true }"
      class="btn btn-light w-100"
      style="border: 1px solid #ced4da"
      ><i class="bi bi-envelope me-1"></i>Signup with Email</router-link
    >
  </div>
</template>
