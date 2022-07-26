<script setup>
import useAppStore from '../../store/app.store.js';

const appStore = useAppStore();

const props = defineProps({
  message: String,
});
</script>

<template>
  <div
    style="
      position: fixed;
      z-index: 999999999999999999;
      top: 80px;
      right: 17px;
      font-size: 0.7rem;
      width: fit-content;
    "
    class="toast show align-items-center bg-success bg-opacity-75 text-white border-0"
    role="alert"
  >
    <div class="d-flex">
      <div class="toast-body">{{ message }}</div>
      <button
        @click="appStore.clearToast()"
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>
