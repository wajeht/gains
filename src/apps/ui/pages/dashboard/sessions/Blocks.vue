<script setup>
import BackHeader from '../../../components/dashboard/headers/Backheader.vue';
</script>


<template>

  <BackHeader />


  <div class="container px-3">
    <div class="flex flex-column justify-content-between my-3" data-aos="fade-up">
      <div class="d-flex flex-column gap-3">
        <!-- account -->
        <div>
          <!-- title -->
          <h5><i class="bi bi-person-fill"></i> Blocks</h5>

          <div class="list-group">
            <!-- chest -->
            <router-link to="" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Top of texas trifecta</h6>
                  <p class="mb-0 opacity-75">Change user account details.</p>
                </div>
              </div>
              <small class="opacity-50 text-nowrap">2022/01/01</small>
            </router-link>

            <!-- triceps  -->
            <router-link to="" class="list-group-item list-group-item-action d-flex gap-3 py-3">
              <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 class="mb-0">Top of texas trifecta</h6>
                  <p class="mb-0 opacity-75">Change user account details.</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

      </div>


    </div>
  </div>
</template>
