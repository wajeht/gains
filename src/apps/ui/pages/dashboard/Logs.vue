<template>
  <div class="my-2 d-flex flex-column gap-2">
    <div v-for="log in logs" data-aos="fade-up" class="card" id="log">
      <div @click="logDetails(1)" class="card-body p-3">
        <div class="row">
          <div class="col-2">
            <div>
              <span>Thu</span>
              <h5 class="card-title">16</h5>
            </div>
          </div>
          <div class="col-10">
            <h5 class="card-title">upperbody workout session</h5>
            <div class="card-text">
              <ul class="list-unstyled">
                <li>close grip bench press</li>
                <li>conventional deadlift</li>
                <li>high bar squat</li>
                <li>overhead shoulder press</li>
              </ul>
            </div>
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
