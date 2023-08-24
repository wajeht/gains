<script setup>
const props = defineProps({
  pagination: {
    total: 0,
    lastPage: 0,
    perPage: 0,
    currentPage: 0,
    from: 0,
    to: 0,
  },
});

const emit = defineEmits(['next', 'previous', 'to']);

function handleNext() {
  emit('next');
}

function handlePrevious() {
  emit('previous');
}

function handleToPage(currentPage) {
  emit('to', currentPage);
}
</script>

<template>
  <nav class="py-2">
    <ul class="pagination justify-content-center mb-0 pb-0">
      <li
        class="page-item"
        :class="{ disabled: pagination.currentPage === 1 || pagination.currentPage === 0 }"
      >
        <a class="page-link" @click="handlePrevious()">Previous</a>
      </li>

      <li
        v-for="(p, index) in pagination.lastPage"
        class="page-item"
        :class="{ active: p === pagination.currentPage }"
      >
        <a class="page-link" @click="handleToPage(p)">{{ p }}</a>
      </li>

      <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.lastPage }">
        <a class="page-link" @click="handleNext()">Next</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination > li > a {
  background-color: white;
  color: #212529;
  cursor: pointer;
}

.pagination > li > a:focus,
.pagination > li > a:hover,
.pagination > li > span:focus,
.pagination > li > span:hover {
  color: #5a5a5a;
  background-color: #eee;
  border-color: #ddd;
  cursor: pointer;
}

.pagination > .active > a {
  color: white;
  background-color: #212529 !important;
  border: solid 1px #212529 !important;
  cursor: pointer;
}

.pagination > .active > a:hover {
  background-color: #212529 !important;
  border: solid 1px #ffffff;
  cursor: pointer;
}
</style>
