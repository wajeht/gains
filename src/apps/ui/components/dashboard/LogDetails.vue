<template>
  <XyzTransition appear xyz="fade small out-down">
    <div class="my-2 d-flex flex-column gap-2">
      <!-- session card -->
      <form class="card p-0">
        <div class="card-body p-3">
          <!-- name -->
          <div class="row mb-2">
            <label class="col-4 col-form-label">Session name</label>
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

      <!-- list of lifts accordions -->
      <div class="accordion">
        <!-- first -->
        <div class="card">
          <div class="card-body">
            <!-- title -->
            <h5
              class="card-title d-flex justify-content-between align-items-center mb-0 align-middle"
            >
              <!-- title -->
              <span>beltless conventional deadlift wth belt no hype</span>

              <!-- options group -->
              <div class="d-flex gap-2">
                <!-- show/hide -->
                <button
                  class="accordion-button p-0 m-0"
                  style="background: none; border: none; box-shadow: none"
                  role="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                ></button>

                <!-- settings -->
                <div class="dropdown">
                  <a
                    class="link-dark"
                    role="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    ><i class="bi bi-three-dots-vertical"></i
                  ></a>
                  <ul class="dropdown-menu dropdown-menu-end" style="min-width: fit-content">
                    <li><button class="dropdown-item btn-sm" type="button">Edit</button></li>
                    <li><button class="dropdown-item btn-sm" type="button">Delete</button></li>
                    <li><button class="dropdown-item btn-sm" type="button">Share</button></li>
                  </ul>
                </div>
              </div>
            </h5>

            <!-- body -->
            <div
              id="panelsStayOpen-collapseOne"
              class="accordion-collapse collapse show table-responsive"
            >
              <table class="table table-striped table-hover table-sm p-0 m-0">
                <thead>
                  <tr>
                    <th class="text-center" scope="col">Set</th>
                    <th class="text-center" scope="col"></th>
                    <th class="text-center" scope="col">Reps</th>
                    <th class="text-center" scope="col"></th>
                    <th class="text-center" scope="col">Weight</th>
                    <th class="text-start" scope="col"></th>
                    <th class="text-start" scope="col">Rpe</th>
                    <th class="text-start" scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="text-center">1</th>
                    <td class="text-center">x</td>
                    <td class="text-center">12</td>
                    <td class="text-center">x</td>
                    <td class="text-center">225</td>
                    <td class="text-start">@</td>
                    <td class="text-start">7</td>
                    <td class="text-start"></td>
                  </tr>
                  <tr>
                    <th class="text-center">2</th>
                    <td class="text-center">x</td>
                    <td class="text-center">11</td>
                    <td class="text-center">x</td>
                    <td class="text-center">235</td>
                    <td class="text-start">@</td>
                    <td class="text-start">8</td>
                    <td class="text-start"></td>
                  </tr>
                  <tr>
                    <th class="text-center">3</th>
                    <td class="text-center">x</td>
                    <td class="text-center">12</td>
                    <td class="text-center">x</td>
                    <td class="text-center">245</td>
                    <td class="text-start">@</td>
                    <td class="text-start">8</td>
                    <td class="text-start text-truncate">
                      <small class="d-flex justify-content-between">
                        <!-- notes -->
                        <!-- <span>
                          heavy as fuck asdfasdfasdf adfasdfasdfasf fasdf as fas fasdf asda asf das
                          fasf</span
                        > -->

                        <!-- option -->
                        <span class="d-flex gap-2 ms-2">
                          <i class="bi bi-pencil"></i>
                          <i class="bi bi-trash"></i>
                        </span>
                      </small>
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

      <!-- add a lift button -->
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
          class="modal fade px-1 pt-5"
          id="add-a-lift"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-scrollable">
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
