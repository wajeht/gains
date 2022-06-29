<template>
  <div class="my-2 d-flex flex-column gap-2">
    <div v-for="log in logs" class="card">
      <div class="card-body p-2">
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
  };
</script>
