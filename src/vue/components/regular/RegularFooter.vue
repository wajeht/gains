<template>
  <footer class="py-4 border-top bg-white mt-4">
    <div class="container d-flex justify-content-between">
      <!-- copyright -->
      <div class="text-muted d-flex gap-2 text-sm-start">
        <span> © 2022 gains.jaw.dev. </span>
        <span id="love"> Made with ❤️ by group of strength athletes</span>
      </div>

      <!-- links -->
      <div class="d-flex gap-3 align-items-center">
        <!-- privacy -->
        <router-link to="/privacy" class="link-secondary text-decoration-none small"
          >Privacy</router-link
        >

        <!-- terms -->
        <router-link to="/terms" class="link-secondary text-decoration-none small"
          >Terms</router-link
        >
      </div>
    </div>
  </footer>
</template>

<style scoped>
@media screen and (max-width: 768px) {
  #love {
    display: none;
  }
}
</style>
