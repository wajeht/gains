<template>
  <!-- ---------- loading ---------- -->
  <div
    id="loading-spinner"
    class="d-flex justify-content-center align-items-center container bg-white"
    style="
      /* width: 100%; */
      max-width: 540px;
      height: 100%;
      position: fixed;
      z-index: 10000;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.7;
    "
  >
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>
