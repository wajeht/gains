<template>
  <div class="container">
    <div class="my-2 d-flex flex-column gap-3" data-aos="fade-up">
      <!-- calculator -->
      <div>
        <!-- title -->
        <h2>Calculators</h2>

        <!-- rpe -->
        <div class="list-group">
          <router-link
            to="/dashboard/tools/calculators/rpe-calculator"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
          >
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">RPE Calculator</h6>
                <p class="mb-0 opacity-75">Calculate rpe with given inputs</p>
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
                <p class="mb-0 opacity-75">
                  Some placeholder content in a paragraph that goes a little longer so it wraps to a
                  new line.
                </p>
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
                  <small class="bg-danger text-white px-1 rounded">new</small>
                </h6>
                <p class="mb-0 opacity-75">Calculator your one rep max of a lift</p>
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
                <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </router-link>
        </div>
      </div>

      <!-- reports -->
      <div>
        <h2>Reports</h2>
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">List group item heading</h6>
                <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Another title here</h6>
                <p class="mb-0 opacity-75">
                  Some placeholder content in a paragraph that goes a little longer so it wraps to a
                  new line.
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Third heading</h6>
                <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>
        </div>
      </div>

      <!-- others -->
      <div>
        <h2>Others</h2>
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">List group item heading</h6>
                <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Another title here</h6>
                <p class="mb-0 opacity-75">
                  Some placeholder content in a paragraph that goes a little longer so it wraps to a
                  new line.
                </p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>
          <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Third heading</h6>
                <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
              </div>
              <!-- <small class="opacity-50 text-nowrap">v1</small> -->
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
