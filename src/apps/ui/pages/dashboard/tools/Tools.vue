<template>
  <DashboardHeader />

  <div class="container px-3 animate__animated animate__fadeIn animate__faster">
    <div class="my-3 d-flex flex-column gap-3">
      <!-- calculator -->
      <div>
        <!-- title -->
        <h5>
          <i class="bi bi-calculator"></i>
          Calculators
        </h5>

        <!-- rpe -->
        <div class="list-group">
          <span
            to="/dashboard/tools/calculators/rpe-calculator"
            style="background: #f1f1f1"
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">RPE Calculator</h6>
                <p class="mb-0 opacity-75">
                  Your coach give you rpe based training? We'll make it easier for you!
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>

          <!-- plate loader -->
          <span
            to="/dashboard/tools/calculators/plate-calculator"
            style="background: #f1f1f1"
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Plate Calculator</h6>
                <p class="mb-0 opacity-75">You don't know what plates to load up? We got you!</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>

          <!-- 1rm -->
          <router-link
            to="/dashboard/tools/calculators/one-rep-max-calculator"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">
                  One Rep Max Calculator
                  <small class="bg-success text-white px-1 rounded" style="padding-bottom: 2.5px"
                    >new</small
                  >
                </h6>
                <p class="mb-0 opacity-75">
                  Calculator your one rep max of a lift and tell your friends!
                </p>
              </div>
              <small class="opacity-50 text-nowrap">v1</small>
            </div>
          </router-link>

          <!-- attempt  -->
          <span
            to="/dashboard/tools/calculators/attempt-selection-calculator"
            style="background: #f1f1f1"
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Meet Attempt Selection Calculator</h6>
                <p class="mb-0 opacity-75">
                  Win against your fellow competitors by making the right decision!
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>
        </div>
      </div>

      <!-- reports -->
      <div>
        <h5><i class="bi bi-table"></i> Reports</h5>
        <div class="list-group">
          <!-- avg -->
          <span
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
            style="background: #f1f1f1"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Average Intensity</h6>
                <p class="mb-0 opacity-75">
                  Lifts with average intensity over a month period of time.
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>

          <!-- maxes -->
          <span
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
            style="background: #f1f1f1"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Maxes Over Time</h6>
                <p class="mb-0 opacity-75">
                  Show all the lifts that significant improved over a month period of time.
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>

          <!-- rpe -->
          <span
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
            style="background: #f1f1f1"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Lifts with RPE 8 or Higher</h6>
                <p class="mb-0 opacity-75">Lifts with rpe 8 or higher that leads into 1RM.</p>
              </div>
              <!-- <small class=" opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>

          <!-- blocks -->
          <router-link
            to="/dashboard/sessions/blocks"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Blocks review</h6>
                <p class="mb-0 opacity-75">View volume dosage and lifts data of blocks</p>
              </div>
            </div>
          </router-link>

          <!-- open powerlifting -->
          <router-link
            to="/dashboard/tools/reports/open-powerlifting"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Open Powerlifting</h6>
                <p class="mb-0 opacity-75">Search lifters inside open powerlifting</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- others -->
      <div>
        <h5><i class="bi bi-wrench"></i> Others</h5>
        <div class="list-group">
          <!-- bodyweight -->
          <span
            to="/dashboard/tools/others/bodyweight-tracker"
            style="background: #f1f1f1"
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Bodyweight tacker</h6>
                <p class="mb-0 opacity-75">
                  Track your bodyweight without logging another session.
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>

          <!-- calories -->
          <span
            to="/dashboard/tools/others/calories-tracker"
            style="background: #f1f1f1"
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Calories Tracker</h6>
                <p class="mb-0 opacity-75">
                  Simple calories tracker for lifters who do not like Myfitnesspal.
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>

          <!-- recovery -->
          <span
            to="/dashboard/tools/others/recovery"
            style="background: #f1f1f1"
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Recovery</h6>
                <p class="mb-0 opacity-75">Track your sleep, mood, and energy.</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>

          <!-- qr codes -->
          <span
            to="/dashboard/tools/others/access-codes"
            style="background: #f1f1f1"
            class="list-group-item list-group-item-action d-flex gap-3 py-3 text-muted"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Access Codes</h6>
                <p class="mb-0 opacity-75">A place to store your access codes</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardHeader from '../../../components/dashboard/DashboardHeader.vue';
export default {
  components: {
    DashboardHeader,
  },
};
</script>
