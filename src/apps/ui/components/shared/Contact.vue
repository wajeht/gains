<template>
  <!-- contact form -->
  <form @submit.prevent="handleSubmit">
    <!-- title -->
    <h1 class="mb-3">Contact</h1>

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

    <!-- Subject -->
    <div class="mb-3">
      <label for="Options" class="form-label">Subject</label>
      <select class="form-select" :disabled="loading" v-model="subject">
        <option v-for="option in subjectOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
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
    <button
      type="submit"
      class="btn btn-primary w-100"
      :disabled="loading || !email || !message || !subject"
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

  <!-- github issue -->
  <div class="text-center">
    <!-- button -->
    <a
      :class="{ disabled: loading === true }"
      class="btn text-white btn-success w-100"
      href="https://github.com/wajeht/gains/issues"
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
      subject: 'GENERAL',
      email: '',
      message: '',
      alert: {
        type: '',
        msg: '',
      },
      loading: false,
    };
  },
  computed: {
    subjectOptions() {
      return [
        { value: 'FEATURE', label: 'Feature Request' },
        { value: 'BUG', label: 'Bugs Report' },
        { value: 'GENERAL', label: 'General' },
        { value: 'OTHER', label: 'OTHER' },
      ];
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;

        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            subject: this.subject,
            message: this.message,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          this.loading = false;
          throw json.errors;
        }

        this.loading = false;

        this.alert.type = 'success';
        this.alert.msg = "We'll get in touch with you soon!";

        this.subject = '';
        this.email = '';
        this.message = '';

        // clear alert success after few sec
        await sleep(5000);

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
