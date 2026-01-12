<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref(false);
const alert = ref({ type: '', msg: '' });

onMounted(() => {
  const error = route.query.error;
  if (error) {
    alert.value.type = 'danger';
    switch (error) {
      case 'invalid_state':
        alert.value.msg = 'Authentication failed. Please try again.';
        break;
      case 'unverified_email':
        alert.value.msg = 'Your Google email is not verified. Please verify your email with Google first.';
        break;
      case 'oauth_failed':
        alert.value.msg = 'Google authentication failed. Please try again.';
        break;
      default:
        alert.value.msg = 'An error occurred. Please try again.';
    }
  }
});

function loginWithGoogle() {
  loading.value = true;
  window.location.href = '/api/auth/google';
}
</script>

<template>
  <!-- alert -->
  <div
    v-if="alert.type"
    :class="`alert-${alert.type}`"
    class="mb-3 alert animate__animated animate__zoomIn animate__faster"
  >
    <span>{{ alert.msg }}</span>
  </div>

  <!-- login card -->
  <div class="text-center">
    <h1 class="mb-4">Login</h1>

    <p class="text-muted mb-4">Sign in to continue to Gains</p>

    <!-- Google login button -->
    <button
      @click="loginWithGoogle"
      :disabled="loading"
      class="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2"
      style="border: 1px solid #ced4da; padding: 12px"
    >
      <div v-if="loading" class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>

      <template v-if="!loading">
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span>Continue with Google</span>
      </template>
      <span v-if="loading">Redirecting...</span>
    </button>

    <p class="text-muted mt-4 small">
      By continuing, you agree to our
      <router-link to="/terms" class="link-secondary">Terms of Service</router-link>
      and
      <router-link to="/privacy" class="link-secondary">Privacy Policy</router-link>
    </p>
  </div>
</template>
