<template>
  <!-- header -->
  <SessionDetailsHeader />

  <!-- session details -->
  <XyzTransition appear xyz="fade small out-down">
    <div class="container px-3">
      <div class="my-3 d-flex flex-column gap-3">
        <!-- sessions card -->
        <form class="card p-0">
          <div class="card-body p-3">
            <!-- session name -->
            <div class="row mb-2">
              <label for="session-name" class="col-4 col-form-label">Session name</label>
              <div class="col-8">
                <input type="text" class="form-control form-control-sm" id="session-name" />
              </div>
            </div>

            <!-- block name -->
            <div class="row mb-2">
              <label for="block-name" class="col-4 col-form-label">Block name</label>
              <div class="col-8">
                <input type="text" class="form-control form-control-sm" id="block-name" />
              </div>
            </div>

            <!-- start time -->
            <div class="row mb-2">
              <label for="start-time" class="col-4 col-form-label">Start time</label>
              <div class="col-8">
                <input type="date" class="form-control form-control-sm" id="start-time" />
              </div>
            </div>

            <!-- end time -->
            <div class="row mb-2">
              <label for="end-time" class="col-4 col-form-label">End time</label>
              <div class="col-8">
                <input type="datetime-local" class="form-control form-control-sm" id="end-time" />
              </div>
            </div>

            <!-- bodyweight  -->
            <div class="row mb-2">
              <label for="bodyweight" class="col-4 col-form-label">Bodyweight</label>
              <div class="col-8">
                <input
                  type="number"
                  class="form-control form-control-sm"
                  id="bodyweight"
                  min="1"
                  step="1"
                  max="500"
                />
              </div>
            </div>

            <!-- hours of sleep  -->
            <div class="row mb-2">
              <label class="col-4 col-form-label" for="hours-of-sleep">Hours of sleep</label>
              <div class="col-8">
                <input
                  type="number"
                  class="form-control form-control-sm"
                  id="hours-of-sleep"
                  min="1"
                  step="1"
                  max="24"
                />
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

        <!-- lifts -->
        <div class="card p-0">
          <div class="card-body">
            <!-- header -->
            <h5 class="card-title d-flex justify-content-between align-items-center mb-0">
              <!-- title -->
              <span>beltless conventional deadlift</span>

              <!-- options -->
              <span class="d-flex gap-2">
                <!-- show/hide button -->
                <button
                  class="accordion-button collapsed p-0 m-0"
                  style="background: none; border: none; box-shadow: none"
                  role="button"
                  data-bs-toggle="collapse"
                  data-bs-target=".beltless-contentional-deadlift"
                ></button>

                <!-- lift settings -->
                <div class="dropdown">
                  <!-- setting icons -->
                  <a
                    class="link-dark"
                    role="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    ><i class="bi bi-three-dots-vertical"></i
                  ></a>

                  <!-- setting links -->
                  <ul class="dropdown-menu dropdown-menu-end" style="min-width: fit-content">
                    <li><button class="dropdown-item btn-sm" type="button">Edit</button></li>
                    <li><button class="dropdown-item btn-sm" type="button">Delete</button></li>
                  </ul>
                </div>
              </span>
            </h5>

            <!-- notes -->
            <p class="my-2 accordion-collapse collapse card-text beltless-contentional-deadlift">
              some notes about what this lift felt like this week. it could be another meaningful as
              did sleep last night, and etc.
            </p>

            <!-- sets -->
            <div
              class="accordion-collapse collapse beltless-contentional-deadlift table-responsive"
            >
              <table class="table table-sm table-striped table-hover p-0 m-0">
                <thead>
                  <tr>
                    <th class="text-center" scope="col">Set</th>
                    <th class="text-center" scope="col"></th>
                    <th class="text-center" scope="col">Rep</th>
                    <th class="text-center" scope="col"></th>
                    <th class="text-center" scope="col">Weight</th>
                    <th class="text-start" scope="col"></th>
                    <th class="text-start" scope="col">Rpe</th>
                    <th class="text-start" scope="col">Notes</th>
                    <th class="text-start" scope="col"></th>
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
                    <td class="text-start"><small>felt like shit</small></td>
                    <td class="text-end">
                      <small class="d-flex justify-content-between gap-2">
                        <i class="bi bi-pencil"></i>
                        <i class="bi bi-trash"></i>
                      </small>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-center">2</th>
                    <td class="text-center">x</td>
                    <td class="text-center">11</td>
                    <td class="text-center">x</td>
                    <td class="text-center">235</td>
                    <td class="text-start">@</td>
                    <td class="text-start">8</td>
                    <td class="text-start"><small>heavy</small></td>
                    <td class="text-end">
                      <small class="d-flex justify-content-between gap-2">
                        <i class="bi bi-pencil"></i>
                        <i class="bi bi-trash"></i>
                      </small>
                    </td>
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
                      <small>
                        heavy as fuck asdfasdfasdf adfasdfasdfasf fasdf as fas fasdf asda asf das
                        fasf
                      </small>
                    </td>
                    <td class="text-end">
                      <small class="d-flex justify-content-between gap-2">
                        <i class="bi bi-pencil"></i>
                        <i class="bi bi-trash"></i>
                      </small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- footer -->
          <div class="card-footer accordion-collapse collapse beltless-contentional-deadlift">
            <span class="d-flex justify-content-between gap-2">
              <!-- left -->
              <span class="d-flex justify-content-between gap-2">
                <!-- add a set group -->
                <span>
                  <!-- add a set model button -->
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#add-a-set"
                  >
                    <i class="bi bi-plus-circle me-1"></i> Add a set
                  </button>

                  <!-- add a set modal -->
                  <form
                    @submit.prevent="handleAddASet()"
                    class="modal fade px-1 pt-5"
                    id="add-a-set"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                  >
                    <div class="modal-dialog modal-dialog-scrollable">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Add a set</h5>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-body">
                          <!-- reps -->
                          <div class="mb-3">
                            <label for="rep" class="form-label">Rep*</label>
                            <input
                              id="rep"
                              class="form-control form-control-sm"
                              type="number"
                              min="1"
                              max="20"
                              step="1"
                              required
                            />
                          </div>

                          <!-- weight -->
                          <div class="mb-3">
                            <label for="weight" class="form-label">Weight*</label>
                            <input
                              id="weight"
                              class="form-control form-control-sm"
                              type="number"
                              min="5"
                              step="5"
                              required
                            />
                          </div>

                          <!-- rpe -->
                          <div class="mb-3">
                            <label for="rpe" class="form-label">Rpe</label>
                            <select id="rpe" class="form-control form-select form-select-sm">
                              <option selected value="" disabled>select a rpe!</option>
                              <option value="5">5</option>
                              <option value="5.5">5.5</option>
                              <option value="6">6</option>
                              <option value="6.5">6.5</option>
                              <option value="7">7</option>
                              <option value="7.5">7.5</option>
                              <option value="8">8</option>
                              <option value="8.5">8.5</option>
                              <option value="9">9</option>
                              <option value="9.5">9.5</option>
                              <option value="10">10</option>
                            </select>
                          </div>

                          <!-- note -->
                          <div class="mb-3">
                            <label class="form-label">Note</label>
                            <textarea
                              class="form-control form-control-sm"
                              id="notes-id"
                              rows="3"
                            ></textarea>
                          </div>
                        </div>

                        <!-- footer -->
                        <div class="modal-footer">
                          <button
                            ref="addASetDismissButton"
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button type="submit" class="btn btn-dark">Add</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </span>

                <!-- add a video group -->
                <span>
                  <button type="button" class="btn btn-sm btn-outline-dark">
                    <i class="bi bi-play-circle me-1"></i> Add a video
                  </button>
                </span>
              </span>

              <!-- right -->
              <span class="d-flex justify-content-between gap-2">
                <button class="btn btn-sm btn-outline-dark">
                  <i class="bi bi-bar-chart me-1"></i>Graphs
                </button>
                <button class="btn btn-sm btn-outline-dark">
                  <i class="bi bi-journal-text me-1"></i>Maxes
                </button>
              </span>
            </span>
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
          <form
            @submit.prevent="handleAddALift()"
            class="modal fade px-2 pt-5"
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
                  <!-- category -->
                  <div class="mb-3">
                    <label for="category" class="form-label">Category*</label>
                    <select id="category" class="form-select" required>
                      <option disabled value="" selected>select a category!</option>
                      <option value="squat">squat</option>
                      <option value="bench">bench</option>
                      <option value="deadlift">deadlift</option>
                      <option value="v-press">press</option>
                    </select>
                  </div>

                  <!-- lift -->
                  <div class="mb-3">
                    <label for="lift" class="form-label">Lift*</label>
                    <select id="lift" class="form-select" required>
                      <option disabled value="" selected>select a lift!</option>
                      <option value="sumo deadlift">sumo deadlift</option>
                      <option value="romanian deadlift">romanian deadlift</option>
                      <option value="stiff legged deadlift">stiff legged deadlift</option>
                      <option value="conventional deadlift">conventional deadlift</option>
                    </select>
                  </div>
                </div>

                <!-- footer -->
                <div class="modal-footer">
                  <!-- cancel -->
                  <button
                    ref="addALiftDismissButton"
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>

                  <!-- add -->
                  <button type="submit" class="btn btn-dark">Add</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- complete current session button -->
        <button
          @click="$router.push('/dashboard/sessions')"
          type="button"
          class="btn btn-dark w-100"
        >
          Complete current session
        </button>
      </div>
    </div>
  </XyzTransition>
</template>
<script>
  import SessionDetailsHeader from '../../components/dashboard/headers/SessionDetailsHeader.vue';
  export default {
    components: {
      SessionDetailsHeader,
    },
    props: ['id'],
    data() {
      return {
        id: this.$route.params.id,
      };
    },
    mounted() {
      // console.log(this.today);
    },
    methods: {
      handleAddALift() {
        this.$refs.addALiftDismissButton.click();
      },
      handleAddASet() {
        this.$refs.addASetDismissButton.click();
      },
    },
  };
</script>
