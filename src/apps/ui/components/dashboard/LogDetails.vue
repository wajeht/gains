<template>
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
            <input type="datetime-local" class="form-control form-control-sm" id="colFormLabelSm" />
          </div>
        </div>

        <!-- end time -->
        <div class="row mb-2">
          <label class="col-4 col-form-label">End time</label>
          <div class="col-8">
            <input type="datetime-local" class="form-control form-control-sm" id="colFormLabelSm" />
          </div>
        </div>

        <!-- bodyweight time -->
        <div class="row mb-2">
          <label class="col-4 col-form-label">Bodyweight</label>
          <div class="col-8">
            <input type="number" class="form-control form-control-sm" id="colFormLabelSm" />
          </div>
        </div>

        <!-- notes -->
        <div class="row mb-2">
          <label class="col-4 col-form-label col-form-label-sm">Notes</label>
          <div class="col-8">
            <textarea
              class="form-control form-control-sm"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
    </form>

    <div class="card p-0">
      <div class="card-body py-2 px-3">
        <span>Add a exercise</span>
      </div>
    </div>
  </div>
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
