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
          <router-link
            to="/dashboard/tools/calculators/rpe-calculator"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
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
          </router-link>

          <!-- plate loader -->
          <router-link
            to="/dashboard/tools/calculators/plate-calculator"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Plate Calculator</h6>
                <p class="mb-0 opacity-75">You don't know what plates to load up? We got you!</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </router-link>

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
          <router-link
            to="/dashboard/tools/calculators/attempt-selection-calculator"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
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
          </router-link>
        </div>
      </div>

      <!-- reports -->
      <div>
        <h5><i class="bi bi-table"></i> Reports</h5>
        <div class="list-group">
          <!-- avg -->
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Average Intensity</h6>
                <p class="mb-0 opacity-75">
                  Lifts with average intensity over a month period of time.
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>

          <!-- maxes -->
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Maxes Over Time</h6>
                <p class="mb-0 opacity-75">
                  Show all the lifts that significant improved over a month period of time.
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>

          <!-- rpe -->
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Lifts with RPE 8 or Higher</h6>
                <p class="mb-0 opacity-75">Lifts with rpe 8 or higher that leads into 1RM.</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>
        </div>
      </div>

      <!-- others -->
      <div>
        <h5><i class="bi bi-wrench"></i> Others</h5>
        <div class="list-group">
          <!-- bodyweight -->
          <router-link
            to="/dashboard/tools/others/bodyweight-tracker"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
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
          </router-link>

          <!-- calories -->
          <router-link
            to="/dashboard/tools/others/calories-tracker"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
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
          </router-link>

          <!-- recovery -->
          <router-link
            to="/dashboard/tools/others/recovery"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Recovery</h6>
                <p class="mb-0 opacity-75">Track your sleep, mood, and energy.</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </router-link>

          <!-- qr codes -->
          <router-link
            to="/dashboard/tools/others/access-codes"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Access Codes</h6>
                <p class="mb-0 opacity-75">A place to store your access codes</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </router-link>
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
