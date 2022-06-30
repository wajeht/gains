<template>
  <form @submit.prevent="handleSubmit" class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
    <h1 class="mb-3">Contact</h1>
    <div class="mb-3">
      <label for="subject" class="form-label">Subject</label>
      <input v-model="subject" type="subject" class="form-control" id="subject" required />
    </div>
    <div class="mb-3">
      <label for="Email" class="form-label">Email</label>
      <input v-model="password" type="Email" class="form-control" id="Email" required />
    </div>
    <div class="mb-3">
      <label for="message" class="form-label">Message</label>
      <textarea class="form-control" id="message" rows="5"></textarea>
    </div>
    <button type="submit" class="btn btn-dark">Send</button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        subject: '',
        email: '',
        message: '',
      };
    },
    methods: {
      handleSubmit() {
        this.$router.push({ path: '/dashboard' });
      },
    },
  };
</script>
