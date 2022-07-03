<template>
  <div class="container">
    <div class="flex flex-column justify-content-between my-3" data-aos="fade-up">
      <!-- setting items -->
      <div class="d-flex flex-column gap-4">
        <!-- account -->
        <div>
          <!-- title -->
          <h3><i class="bi bi-person-fill"></i> Account</h3>

          <div class="list-group">
            <!-- user details -->
            <router-link to="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">User details</h6>
                  <p class="mb-0 opacity-75">Change user account details</p>
                </div>
              </div>
            </router-link>

            <!-- delete  -->
            <router-link to="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Delete your account</h6>
                  <p class="mb-0 opacity-75">This action cannot be revert back to normal state!</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- data -->
        <div>
          <h4><i class="bi bi-file-earmark-bar-graph"></i> Data</h4>
          <div class="list-group">
            <!-- email -->
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Export to email</h6>
                  <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
                </div>
                <!-- <small class="opacity-50 text-nowrap">v1</small> -->
              </div>
            </a>

            <!-- csv -->
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Export to CSV</h6>
                  <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
                </div>
                <!-- <small class="opacity-50 text-nowrap">v1</small> -->
              </div>
            </a>
          </div>
        </div>

        <!-- others -->
        <div>
          <h4><i class="bi bi-code-slash"></i> Others</h4>
          <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Help and Support</h6>
              </div>
            </a>
            <router-link
              to="/dashboard/contact"
              class="list-group-item list-group-item-action d-flex gap-3 py-3"
            >
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Send Feedback</h6>
              </div>
            </router-link>
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <h6 class="mb-0">Changelogs</h6>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- footer -->
      <div class="text-center text-muted mt-3">
        <span class="d-flex flex-column justify-content-between">
          <!-- version -->
          <small>
            Version:
            <a href="#" class="link-secondary text-decoration-none" target="_blank">1.0.0</a>
          </small>

          <!-- copyright -->
          <small>
            Made with ❤️ by
            <a
              href="https://www.github.com/wajeht"
              class="link-secondary text-decoration-none"
              target="_blank"
              >@wajeht</a
            >
            and other
            <a
              href="https://www.github.com/allkindsofgains"
              class="link-secondary text-decoration-none"
              target="_blank"
              >contributors</a
            >
          </small>
        </span>
      </div>
    </div>
  </div>
</template>
