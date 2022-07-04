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
    <span role="button" @click="$router.back()" class="link-secondary">
      <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
        <font-awesome-icon icon="angle-left" class="p-0 m-0" />
        {{ previousPageName }}
      </h5>
    </span>

    <!-- middle -->
    <!-- <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." /> -->

    <!-- Edit -->
    <!-- <button class="btn btn-outline-dark">
      <i class="bi bi-pencil-square"></i>
      Edit
    </button> -->

    <div class="dropdown">
      <!-- setting icons -->
      <a
        class="link-dark"
        role="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <i class="bi bi-three-dots-vertical"> </i>
        </h5>
      </a>

      <!-- setting links -->
      <ul class="dropdown-menu dropdown-menu-end shadow-sm" style="min-width: fit-content">
        <li><button class="dropdown-item btn-sm" type="button">Edit</button></li>
        <li><button class="dropdown-item btn-sm" type="button">Delete</button></li>
      </ul>
    </div>
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
