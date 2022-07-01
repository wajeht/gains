<template>
  <div class="my-2 d-flex flex-column gap-2">
    <div v-for="log in logs" data-aos="fade-up" class="card" id="log">
      <div @click="logDetails(1)" class="card-body p-3">
        <div class="d-flex justify-content-between gap-5">
          <!-- start -->
          <div>
            <span>Thu</span>
            <h5 class="card-title">16</h5>
          </div>

          <!-- middle -->
          <div class="flex-grow-1">
            <h5 class="card-title">upperbody workout session xxxxxxxxxxx</h5>
            <div class="card-text">
              <ul class="list-unstyled mb-0 pb-0">
                <li>close grip bench press</li>
                <li>conventional deadlift</li>
                <li>high bar squat</li>
                <li>overhead shoulder press</li>
              </ul>
            </div>
          </div>

          <!-- end -->
          <div>
            <small class="text-muted d-block text-end">123 min</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        logs: 12,
      };
    },
    methods: {
      logDetails(id) {
        this.$router.push({
          // path: `/dashboard/logs/${id}`,
          name: 'LogDetails',
          params: { id: id },
        });
      },
    },
  };
</script>

<style>
  #log:hover {
    /* background: green; */
    background: #f4f4f4;
    cursor: pointer;
  }
</style>
