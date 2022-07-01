<template>
  <form
    @submit.prevent="handleSubmit"
    class="px-4 col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto animate__animated animate__fadeIn"
  >
    <!-- title -->
    <h1 class="mb-3">Contact</h1>

    <!-- alert -->
    <div v-if="alert.length" class="mb-3 alert alert-success">
      <span>{{ alert }}</span>
    </div>

    <!-- subject -->
    <div class="mb-3">
      <label for="subject" class="form-label">Subject</label>
      <input
        v-model="subject"
        type="subject"
        class="form-control"
        id="subject"
        :disabled="loading"
        required
      />
    </div>

    <!-- email -->
    <div class="mb-3">
      <label for="Email" class="form-label">Email</label>
      <input
        v-model="email"
        type="Email"
        class="form-control"
        id="Email"
        :disabled="loading"
        required
      />
    </div>

    <!-- message -->
    <div class="mb-3">
      <label for="message" class="form-label">Message</label>
      <textarea
        v-model="message"
        class="form-control"
        id="message"
        rows="5"
        :disabled="loading"
        required
      ></textarea>
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
      subject: '',
      email: '',
      message: '',
      alert: '',
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;

      await sleep(3000);

      this.loading = false;

      this.alert = "We'll get in touch with you soon!";

      this.subject = '';
      this.email = '';
      this.message = '';
    },
  },
};
</script>
