<template>
  <div
    style="height: 64px"
    class="
      container
      sticky-top
      d-flex
      justify-content-between
      align-items-center
      bg-white
      border-bottom
      py-3
      gap-3
    "
  >
    <!-- back -->
    <button @click="$router.back()" class="btn btn-outline-dark">
      <font-awesome-icon icon="angle-left" class="p-0 m-0" />
      {{ previousPageName }}
    </button>

    <!-- middle -->
    <!-- <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." /> -->

    <!-- Edit -->
    <button class="btn btn-outline-dark">
      <i class="bi bi-pencil-square"></i>
      Edit
    </button>
  </div>
</template>

<script>
  import { capitalizeAWord } from '../../../../../utils/helpers.js';
  export default {
    data() {
      return {
        previousPageName: '',
      };
    },
    mounted() {
      let back = this.$router.currentRoute._value.fullPath.split('/');
      back = back[back.length - 2];
      this.previousPageName = capitalizeAWord(back);
    },
  };
</script>

<style scoped>
  .text-muted {
    color: #8c8c8c;
  }

  a {
    text-decoration: none;
    color: grey;
  }

  a:hover {
    color: #191919;
  }

  .active {
    text-decoration: none;
    color: #191919;
  }
</style>
