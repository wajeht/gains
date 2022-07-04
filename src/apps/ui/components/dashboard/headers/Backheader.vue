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
