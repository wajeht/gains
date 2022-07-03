<template>
  <DashboardHeader />

  <div class="container px-3">
    <div class="my-3 d-flex flex-column gap-3">
      <div v-for="session in sessions" data-aos="fade-up" class="card" id="log">
        <div @click="logDetails(1)" class="card-body">
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
  </div>
</template>

<script>
  import DashboardHeader from '../../components/dashboard/DashboardHeader.vue';
  export default {
    components: {
      DashboardHeader,
    },
    data() {
      return {
        sessions: 12,
      };
    },
    methods: {
      logDetails(id) {
        this.$router.push({
          // path: `/dashboard/session/${id}`,
          name: 'SessionDetails',
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
