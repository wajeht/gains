<template>
  <XyzTransition appear xyz="fade small out-down">
    <div class="my-2 d-flex flex-column gap-2">
      <!-- session card -->
      <form class="card p-0">
        <div class="card-body p-3">
          <!-- name -->
          <div class="row mb-2">
            <label class="col-4 col-form-label">Name</label>
            <div class="col-8">
              <input type="email" class="form-control form-control-sm" id="colFormLabelSm" />
            </div>
          </div>

          <!-- start time -->
          <div class="row mb-2">
            <label class="col-4 col-form-label">Start time</label>
            <div class="col-8">
              <input
                type="datetime-local"
                class="form-control form-control-sm"
                id="colFormLabelSm"
              />
            </div>
          </div>

          <!-- end time -->
          <div class="row mb-2">
            <label class="col-4 col-form-label">End time</label>
            <div class="col-8">
              <input
                type="datetime-local"
                class="form-control form-control-sm"
                id="colFormLabelSm"
              />
            </div>
          </div>

          <!-- bodyweight  -->
          <div class="row mb-2">
            <label class="col-4 col-form-label">Bodyweight</label>
            <div class="col-8">
              <input type="number" class="form-control form-control-sm" id="bodyweight-id" />
            </div>
          </div>

          <!-- hours of sleep  -->
          <div class="row mb-2">
            <label class="col-4 col-form-label">Hours of sleep</label>
            <div class="col-8">
              <input type="number" class="form-control form-control-sm" id="hours-of-sleep-id" />
            </div>
          </div>

          <!-- session rpe  -->
          <div class="row mb-2">
            <label class="col-4 col-form-label">Session RPE </label>
            <div class="col-8">
              <input
                type="number"
                step=".5"
                min="5"
                max="10"
                class="form-control form-control-sm"
                id="session-rpe-id"
              />
            </div>
          </div>

          <!-- notes -->
          <div class="row mb-2">
            <label class="col-4 col-form-label">Notes</label>
            <div class="col-8">
              <textarea class="form-control form-control-sm" id="notes-id" rows="3"></textarea>
            </div>
          </div>
        </div>
      </form>

      <!-- add a exercise -->
      <div class="card p-0">
        <div class="card-body py-2 px-3">
          <span>Add a exercise</span>
        </div>
      </div>

      <!-- single exercise -->
      <div class="card p-0">
        <div class="card-body py-2">
          <p>sumo conventional deadlift</p>
          <div class="row">
            <div class="col-2">
              <!-- <input type="number" class="form-control form-control-sm" placeholder="set" /> -->
              <span>1</span>
            </div>
            <div class="col-2">
              <input type="number" class="form-control form-control-sm" placeholder="reps" />
            </div>
            <div class="col-2">
              <input type="number" class="form-control form-control-sm" placeholder="weight" />
            </div>
            <div class="col-2">
              <input type="number" class="form-control form-control-sm" placeholder="rpe" />
            </div>
            <div class="col-4">
              <input type="text" class="form-control form-control-sm" placeholder="notes" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </XyzTransition>
</template>
<script>
  export default {
    props: ['id'],
    data() {
      return {
        id: this.$route.params.id,
      };
    },
  };
</script>
