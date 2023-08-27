<template>
  <div
    class="px-4 col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto animate__animated animate__fadeIn text-center d-flex flex-column gap-3"
  >
    <!-- icon -->
    <div>
      <i v-if="alert.type === ''" class="bi bi-envelope" style="font-size: 5rem"></i>
      <i v-if="alert.type === 'success'" class="bi bi-envelope-check" style="font-size: 5rem"></i>
      <i v-if="alert.type === 'danger'" class="bi bi-envelope-x" style="font-size: 5rem"></i>
    </div>

    <h2 v-if="alert.type === 'success'">Verification success!</h2>
    <h2 v-if="alert.type === 'danger'">Verification failed!</h2>
    <h2 v-if="verifying">Verifying</h2>

    <!-- spinner -->
    <div v-if="verifying" class="spinner-border spinner-border-sm mx-auto mt-5" role="status">
      <span class="visually-hidden text-center">Loading...</span>
    </div>

    <!-- alert -->
    <div
      v-if="alert.type"
      :class="`alert-${alert.type}`"
      class="mb-3 alert animate__animated animate__zoomIn animate__faster"
    >
      <span>{{ alert.msg }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['uid'],
  data() {
    return {
      alert: {
        type: '',
        msg: '',
      },
      verifying: true,
      token: this.$route.query.token,
    };
  },
  mounted() {
    this.verifyEmail();
  },
  methods: {
    async verifyEmail() {
      try {
        const res = await fetch(`/api/auth/verify-email/${this.uid}?token=${this.token}`);
        const json = await res.json();
        if (res.status >= 500) {
          throw new Error(
            'The server encountered an internal error or misconfiguration and was unable to complete your request. Please try again later!',
          );
        }
        if (!res.ok) {
          this.verifying = false;
          throw json.errors;
        }

        this.alert.type = 'success';
        this.alert.msg = 'Thank you for your support, we have successfully verified your email address, You can now proceed to login to Gains!.'; // prettier-ignore
        this.verifying = false;
      } catch (e) {
        this.verifying = false;
        this.alert.type = 'danger';
        this.alert.msg = e.map((cur) => cur.msg).join(' ');
      }
    },
  },
};
</script>
