<template>
  <footer class="py-4 border-top bg-white mt-4">
    <div class="container d-flex justify-content-between">
      <!-- copyright -->
      <div class="text-muted d-flex gap-2">
        <span> Copyright © 2022 gains.jaw.dev. </span>
        <span id="love"> Made with ❤️ by group of strength athletes! </span>
      </div>

      <!-- social links -->
      <div class="d-flex gap-2">
        <!-- github -->
        <a class="link-secondary" href="https://github.com/allkindsofgains" target="_blank"
          ><i class="bi bi-github"></i
        ></a>

        <!-- discord -->
        <a
          class="link-secondary"
          href="https://discord.com/channels/988167900420534273/989628732895543296"
          target="_blank"
          ><i class="bi bi-discord"></i
        ></a>
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
