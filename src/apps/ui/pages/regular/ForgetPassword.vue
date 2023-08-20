<template>
  <div
    class="px-4 col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto animate__animated animate__fadeIn"
  >
    <!-- form -->
    <form @submit.prevent="handleSubmit">
      <!-- title -->
      <h1 class="mb-3">Forget Password</h1>

      <!-- alert -->
      <div
        v-if="alert.type"
        :class="`alert-${alert.type}`"
        class="mb-3 alert animate__animated animate__zoomIn animate__faster"
      >
        <span>{{ alert.msg }}</span>
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
      <button type="submit" class="btn btn-dark w-100" :disabled="loading || !email">
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
export default {
  data() {
    return {
      email: '',
      loading: false,
      alert: {
        type: '',
        msg: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;

        const res = await fetch('/api/auth/forget-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          this.loading = false;
          throw json.errors;
        }

        this.loading = false;

        this.alert.type = 'success';
        this.alert.msg = `If you have an account with us, well will send a temporary password to your email!`; // prettier-ignore

        this.email = '';
      } catch (e) {
        this.alert.type = 'danger';
        this.alert.msg = e.map((cur) => cur.msg).join(' ');
      }
    },
  },
};
</script>
