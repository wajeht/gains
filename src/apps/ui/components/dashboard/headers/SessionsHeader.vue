<template>
  <div
    id="sessions-header"
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
    <!-- ---------- add group ---------- -->
    <span>
      <!-- add button -->
      <span
        class="link-secondary"
        role="button"
        data-bs-toggle="modal"
        data-bs-target="#add-a-session"
      >
        <h5 class="m-0 p-0 d-flex justify-content-center align-items-center gap-2">
          <font-awesome-icon icon="plus" class="p-0 m-0" />
          <span>Add</span>
        </h5>
      </span>

      <!-- add modal -->
      <form
        @submit.prevent="handleAddASession()"
        class="modal fade px-2 pt-5"
        id="add-a-session"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add a session</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <!-- session name -->
              <div class="mb-3">
                <label for="session-name" class="form-label">Session name*</label>
                <input
                  id="session-name"
                  class="form-control form-control-sm"
                  type="text"
                  required
                />
              </div>

              <!-- start time -->
              <div class="mb-3">
                <label for="start-time" class="form-label">Start time*</label>
                <input
                  id="start-time"
                  class="form-control form-control-sm"
                  type="datetime-local"
                  :value="date"
                  required
                  disabled
                />
              </div>

              <!-- show/hide button -->
              <div class="mx-auto" style="max-width: 40%">
                <button
                  class="accordion-button collapsed p-0 m-0"
                  style="background: none; border: none; box-shadow: none"
                  role="button"
                  data-bs-toggle="collapse"
                  data-bs-target=".add-session-other-settings"
                >
                  Other fields
                </button>
              </div>

              <span class="add-session-other-settings accordion-collapse collapse">
                <!-- block name -->
                <div class="mb-3">
                  <label for="block-name" class="form-label">Block name</label>
                  <input id="block-name" class="form-control form-control-sm" type="text" />
                </div>

                <!-- bodyweight  -->
                <div class="mb-3">
                  <label for="bodyweight" class="form-label">Bodyweight</label>
                  <input
                    id="bodyweight"
                    class="form-control form-control-sm"
                    min="1"
                    type="number"
                  />
                </div>

                <!-- hours of sleep  -->
                <div class="mb-3">
                  <label for="sleep" class="form-label">Hours of sleep</label>
                  <input id="sleep" class="form-control form-control-sm" min="1" type="number" />
                </div>

                <!-- notes -->
                <div class="mb-2">
                  <label for="notes" class="form-label">Notes</label>
                  <textarea class="form-control form-control-sm" id="notes" rows="3"></textarea>
                </div>
              </span>
            </div>
            <div class="modal-footer">
              <button
                ref="addASessionDismissButton"
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

    <!-- middle -->
    <!-- <input type="text" class="form-control form-control-sm" id="search" placeholder="Search.." /> -->

    <!-- settings -->
    <router-link :class="{ active: $route.name === 'Settings' }" to="/dashboard/settings">
      <font-awesome-icon class="fs-4" icon="gear" />
    </router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sessionName: '',
        blockName: '',
        date: null,
        bodyweight: '',
        hoursOfSleep: '',
        notes: '',
      };
    },
    mounted() {
      // back drop problem fixed
      document.body.appendChild(document.getElementById('add-a-session'));

      // init date
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      this.date = now.toISOString().slice(0, 16);
    },
    methods: {
      handleAddASession() {
        this.$refs.addASessionDismissButton.click();
      },
    },
  };
</script>

<style scoped>
  .text-muted {
    color: #8c8c8c;
  }

  a {
    text-decoration: none;
    color: grey;
  }

  a:hover {
    color: #191919;
  }

  .active {
    text-decoration: none;
    color: #191919;
  }
</style>
