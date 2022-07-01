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

      <div class="accordion" id="accordionPanelsStayOpenExample">
        <!-- first -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="panelsStayOpen-headingOne">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              competition deadlift
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            class="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-headingOne"
          >
            <div class="accordion-body table-responsive-sm w-100">
              <table class="table table-sm table-striped table-hover">
                <thead>
                  <tr>
                    <th class="align-middle text-center" scope="col">Sets</th>
                    <th class="align-middle text-center" scope="col">Reps</th>
                    <th class="align-middle text-center" scope="col">Weight</th>
                    <th class="align-middle text-center" scope="col">RPE</th>
                    <th class="align-middle" scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="align-middle text-center" scope="row">3</th>
                    <td class="align-middle text-center">4</td>
                    <td class="align-middle text-center">565</td>
                    <td class="align-middle text-center">@9</td>
                    <td class="align-middle text-truncate" style="max-width: 111px">
                      <small> miss-grooved asdfasdfasdf</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- second -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              Accordion Item #2
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            class="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingTwo"
          >
            <div class="accordion-body">
              <strong>This is the second item's accordion body.</strong> It is hidden by default,
              until the collapse plugin adds the appropriate classes that we use to style each
              element. These classes control the overall appearance, as well as the showing and
              hiding via CSS transitions. You can modify any of this with custom CSS or overriding
              our default variables. It's also worth noting that just about any HTML can go within
              the <code>.accordion-body</code>, though the transition does limit overflow.
            </div>
          </div>
        </div>

        <!-- third -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="panelsStayOpen-headingThree">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree"
            >
              Accordion Item #3
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            class="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingThree"
          >
            <div class="accordion-body">
              <strong>This is the third item's accordion body.</strong> It is hidden by default,
              until the collapse plugin adds the appropriate classes that we use to style each
              element. These classes control the overall appearance, as well as the showing and
              hiding via CSS transitions. You can modify any of this with custom CSS or overriding
              our default variables. It's also worth noting that just about any HTML can go within
              the <code>.accordion-body</code>, though the transition does limit overflow.
            </div>
          </div>
        </div>
      </div>

      <!-- add a exercise -->
      <div class="border">
        <!-- model button -->
        <button
          type="button"
          class="btn btn-secondary w-100"
          data-bs-toggle="modal"
          data-bs-target="#add-a-lift"
        >
          Add a lift
        </button>

        <!-- modal -->
        <div
          class="modal fade"
          id="add-a-lift"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add a lift</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form>
                  <!-- categories -->
                  <div class="mb-3">
                    <label for="categories" class="form-label">Categories</label>
                    <select id="categories" class="form-select">
                      <option>squat</option>
                      <option>bench</option>
                      <option>deadlift</option>
                      <option>press</option>
                    </select>
                  </div>

                  <!-- lift -->
                  <div class="mb-3">
                    <label for="lift" class="form-label">Lift</label>
                    <select id="lift" class="form-select">
                      <option>sumo deadlift</option>
                      <option>romanian deadlift</option>
                      <option>stiff legged deadlift</option>
                      <option>conventional deadlift</option>
                    </select>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-dark">Add</button>
              </div>
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
