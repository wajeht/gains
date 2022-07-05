<template>
  <!-- contact form -->
  <form @submit.prevent="handleSubmit">
    <!-- title -->
    <h1 class="mb-3">Contact</h1>

    <!-- alert -->
    <div
      v-if="alert.length"
      class="mb-3 alert alert-success animate__animated animate__zoomIn animate__faster"
    >
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

  <!-- github issue -->
  <div class="text-center">
    <!-- button -->
    <a
      :class="{ disabled: loading === true }"
      class="btn text-white btn-success w-100"
      href="https://github.com/allkindsofgains/gains/issues"
      target="_blank"
      ><i class="bi bi-github me-1"></i> New issue</a
    >

    <!-- text -->
    <p class="fst-normal mt-4">
      Send us a Github issue to get involve directly with our development workflow!
    </p>
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

        await sleep(5000);

        this.alert = '';
      },
    },
  };
</script>
