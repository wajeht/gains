<script setup>
import RegularHeader from '../components/regular/RegularHeader.vue';
import RegularFooter from '../components/regular/RegularFooter.vue';
import ActivityLog from '../components/admin/ActivityLog.vue';
import AdminMenuBar from '../components/admin/AdminMenuBar.vue';
</script>

<template>
  <div id="regular" class="d-flex flex-column min-vh-100">
    <RegularHeader />

    <div class="px-4 animate__animated animate__fadeIn flex-grow-1 container">
      <div class="row gap-2">
        <!-- menu -->
        <div class="col-sm-12 col-lg-3">
          <!-- menu -->
          <AdminMenuBar />
        </div>

        <!-- card -->
        <div class="col d-flex flex-column gap-4">
          <!-- admin pages -->
          <router-view> </router-view>

          <!-- log -->
          <ActivityLog />
        </div>
      </div>
    </div>

    <RegularFooter />
  </div>
</template>
